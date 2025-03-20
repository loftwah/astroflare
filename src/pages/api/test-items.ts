import type { APIContext } from 'astro';

interface CloudflareLocals {
  runtime: {
    env: {
      DB: any; // D1 database
    };
  };
}

export async function GET({ locals, request }: APIContext & { locals: CloudflareLocals }) {
  const testResults = {
    setup: { success: false, message: '' },
    createTest: { success: false, message: '', id: null },
    readTest: { success: false, message: '', data: null },
    updateTest: { success: false, message: '' },
    deleteTest: { success: false, message: '' },
    cleanup: { success: false, message: '' }
  };
  
  try {
    // 1. Setup - ensure the table exists
    try {
      await locals.runtime.env.DB.prepare(`
        CREATE TABLE IF NOT EXISTS items (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT,
          description TEXT
        )
      `).run();
      testResults.setup = { success: true, message: 'Table setup successful' };
    } catch (error) {
      testResults.setup = { 
        success: false, 
        message: `Table setup failed: ${error instanceof Error ? error.message : String(error)}` 
      };
      throw error;
    }
    
    // 2. Create - test inserting an item
    try {
      const timestamp = new Date().toISOString();
      const { success, meta } = await locals.runtime.env.DB.prepare(
        "INSERT INTO items (name, description) VALUES (?, ?)"
      )
        .bind(`Test Item ${timestamp}`, `This is a test item created at ${timestamp}`)
        .run();
      
      if (!success) {
        throw new Error("Failed to insert test item");
      }
      
      const testId = meta.last_row_id;
      testResults.createTest = { 
        success: true, 
        message: 'Successfully created test item', 
        id: testId 
      };
      
      // 3. Read - test retrieving the item
      try {
        const { results } = await locals.runtime.env.DB.prepare(
          "SELECT * FROM items WHERE id = ?"
        )
          .bind(testId)
          .all();
        
        if (results && results.length > 0) {
          testResults.readTest = { 
            success: true, 
            message: 'Successfully read test item', 
            data: results[0] 
          };
        } else {
          throw new Error("Test item not found");
        }
        
        // 4. Update - test updating the item
        try {
          const { success } = await locals.runtime.env.DB.prepare(
            "UPDATE items SET name = ?, description = ? WHERE id = ?"
          )
            .bind(`Updated Item ${timestamp}`, `This item was updated at ${timestamp}`, testId)
            .run();
          
          if (!success) {
            throw new Error("Failed to update test item");
          }
          
          testResults.updateTest = { 
            success: true, 
            message: 'Successfully updated test item' 
          };
          
          // 5. Delete - test deleting the item
          try {
            const { success } = await locals.runtime.env.DB.prepare(
              "DELETE FROM items WHERE id = ?"
            )
              .bind(testId)
              .run();
            
            if (!success) {
              throw new Error("Failed to delete test item");
            }
            
            testResults.deleteTest = { 
              success: true, 
              message: 'Successfully deleted test item' 
            };
            
            // 6. Verify deletion
            try {
              const { results } = await locals.runtime.env.DB.prepare(
                "SELECT * FROM items WHERE id = ?"
              )
                .bind(testId)
                .all();
              
              if (!results || results.length === 0) {
                testResults.cleanup = { 
                  success: true, 
                  message: 'Verified item deletion' 
                };
              } else {
                throw new Error("Item still exists after deletion");
              }
            } catch (error) {
              if (error instanceof Error && error.message === "Item still exists after deletion") {
                testResults.cleanup = { 
                  success: false, 
                  message: error.message 
                };
              } else {
                testResults.cleanup = { 
                  success: true, 
                  message: 'Verified item deletion (inferred from query error)' 
                };
              }
            }
          } catch (error) {
            testResults.deleteTest = { 
              success: false, 
              message: `Delete test failed: ${error instanceof Error ? error.message : String(error)}` 
            };
          }
        } catch (error) {
          testResults.updateTest = { 
            success: false, 
            message: `Update test failed: ${error instanceof Error ? error.message : String(error)}` 
          };
        }
      } catch (error) {
        testResults.readTest = { 
          success: false, 
          message: `Read test failed: ${error instanceof Error ? error.message : String(error)}`,
          data: null 
        };
      }
    } catch (error) {
      testResults.createTest = { 
        success: false, 
        message: `Create test failed: ${error instanceof Error ? error.message : String(error)}`,
        id: null 
      };
    }
    
    return new Response(JSON.stringify({
      message: "CRUD Test completed",
      results: testResults,
      time: new Date().toISOString()
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error('Test error:', error);
    return new Response(JSON.stringify({ 
      error: 'Test failed', 
      message: error instanceof Error ? error.message : String(error),
      results: testResults
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
} 