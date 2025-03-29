import type { APIContext } from 'astro';
import { verifyAuth, unauthorizedResponse } from '../../utils/auth';

// Define proper types for Cloudflare environment
interface Env {
  DB: any; // D1 database
  STORAGE?: any;
}

interface CloudflareRuntime {
  env: Env;
}

// Extend the Locals interface
declare namespace App {
  interface Locals {
    runtime: CloudflareRuntime;
  }
}

interface Item {
  id?: number;
  name: string;
  description: string;
  image?: string;
  [key: string]: any;
}

// We'll use these sample items when no database is available
const sampleItems: Item[] = [
  {
    id: 1,
    name: "Test Item 1",
    description: "This is a test item with an image from R2 storage",
    image: "/storage/images/astroflare.jpg"
  },
  {
    id: 2,
    name: "Test Item 2",
    description: "Another test item with the same image from R2 storage",
    image: "/storage/images/astroflare.jpg"
  },
  {
    id: 3,
    name: "Test Item 3",
    description: "Yet another test item with an image from R2",
    image: "/storage/images/astroflare.jpg"
  }
];

// GET all items
export async function GET({ locals, request }: APIContext) {
  // Add authentication check
  if (!verifyAuth(request)) {
    return unauthorizedResponse();
  }

  try {
    // Try to get items from D1 if available
    const env = locals.runtime.env;
    let items: Item[] = [];
    
    if (env.DB) {
      const result = await env.DB.prepare("SELECT * FROM items ORDER BY id DESC LIMIT 50").all();
      items = result.results || [];
      
      // If no items in DB, use sample items
      if (items.length === 0) {
        items = sampleItems;
      }
      
      // Add image property to any DB items that don't have it
      items = items.map((item: Item) => ({
        ...item,
        image: item.image || "/storage/images/astroflare.jpg"
      }));
    } else {
      // No DB available, use sample items
      items = sampleItems;
    }
    
    // MODIFIED: Return the expected structure with success and data properties
    return new Response(JSON.stringify({
      success: true,
      data: items
    }), {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error fetching items:', error);
    // MODIFIED: Return with success: false for consistency
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'Failed to fetch items',
      message: error instanceof Error ? error.message : String(error)
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}

// POST - create a new item
export async function POST({ request, locals }: APIContext) {
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
export async function PUT({ request, locals }: APIContext) {
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
export async function DELETE({ request, locals }: APIContext) {
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