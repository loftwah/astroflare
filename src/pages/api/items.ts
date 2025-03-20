import type { APIContext } from 'astro';
import { verifyAuth, unauthorizedResponse } from '../../utils/auth';

interface CloudflareLocals {
  runtime: {
    env: {
      DB: any; // D1 database
    };
  };
}

interface Item {
  id?: number;
  name: string;
  description: string;
}

// GET all items
export async function GET({ locals, request }: APIContext & { locals: CloudflareLocals }) {
  // Check authentication
  if (!verifyAuth(request)) {
    return unauthorizedResponse();
  }
  
  try {
    const { results } = await locals.runtime.env.DB.prepare("SELECT * FROM items").all();
    
    return new Response(JSON.stringify({
      success: true,
      data: results
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error('Error fetching items:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error instanceof Error ? error.message : String(error)
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// POST - create a new item
export async function POST({ request, locals }: APIContext & { locals: CloudflareLocals }) {
  // Check authentication
  if (!verifyAuth(request)) {
    return unauthorizedResponse();
  }
  
  try {
    const item: Item = await request.json();
    
    if (!item.name) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: "Name is required" 
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
    
    const { success, meta } = await locals.runtime.env.DB.prepare(
      "INSERT INTO items (name, description) VALUES (?, ?)"
    )
      .bind(item.name, item.description || "")
      .run();
    
    if (!success) {
      throw new Error("Failed to insert item");
    }
    
    return new Response(JSON.stringify({
      success: true,
      id: meta.last_row_id
    }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error('Error creating item:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error instanceof Error ? error.message : String(error)
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// PUT - update an existing item
export async function PUT({ request, locals }: APIContext & { locals: CloudflareLocals }) {
  // Check authentication
  if (!verifyAuth(request)) {
    return unauthorizedResponse();
  }
  
  try {
    const item: Item = await request.json();
    
    if (!item.id) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: "Item ID is required" 
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
    
    const { success } = await locals.runtime.env.DB.prepare(
      "UPDATE items SET name = ?, description = ? WHERE id = ?"
    )
      .bind(item.name, item.description || "", item.id)
      .run();
    
    if (!success) {
      throw new Error("Failed to update item");
    }
    
    return new Response(JSON.stringify({
      success: true,
      message: "Item updated successfully"
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error('Error updating item:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error instanceof Error ? error.message : String(error)
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// DELETE - delete an item
export async function DELETE({ request, locals }: APIContext & { locals: CloudflareLocals }) {
  // Check authentication
  if (!verifyAuth(request)) {
    return unauthorizedResponse();
  }
  
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    
    if (!id) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: "Item ID is required" 
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
    
    const { success } = await locals.runtime.env.DB.prepare(
      "DELETE FROM items WHERE id = ?"
    )
      .bind(parseInt(id))
      .run();
    
    if (!success) {
      throw new Error("Failed to delete item");
    }
    
    return new Response(JSON.stringify({
      success: true,
      message: "Item deleted successfully"
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error('Error deleting item:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error instanceof Error ? error.message : String(error)
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
} 