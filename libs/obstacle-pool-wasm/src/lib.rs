use std::collections::HashMap;
use wasm_bindgen::prelude::*;
use serde::{Serialize, Deserialize};
use rand::Rng;

// Initialize panic hook for better error messages
fn init_panic_hook() {
    console_error_panic_hook::set_once();
}

// Custom error type for wasm
#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
    
    #[wasm_bindgen(js_namespace = console, js_name = log)]
    fn log_obj(obj: &JsValue);
}

// Define obstacle types - must match TypeScript enum
#[wasm_bindgen]
#[derive(Serialize, Deserialize, Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub enum ObstacleType {
    Dodge = 0,
    Jump = 1,
    Slide = 2,
    Sponsor = 3,
    Question = 4,
    Hint = 5,
    Coin = 6,
}

// Vector3 type to match Three.js Vector3
#[wasm_bindgen]
#[derive(Serialize, Deserialize, Debug, Clone, Copy)]
pub struct Vector3 {
    pub x: f32,
    pub y: f32,
    pub z: f32,
}

#[wasm_bindgen]
impl Vector3 {
    #[wasm_bindgen(constructor)]
    pub fn new(x: f32, y: f32, z: f32) -> Vector3 {
        Vector3 { x, y, z }
    }
    
    pub fn set(&mut self, x: f32, y: f32, z: f32) {
        self.x = x;
        self.y = y;
        self.z = z;
    }
}

// Obstacle instance metadata
#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct ObstacleMetadata {
    pub id: String,
    pub type_value: ObstacleType,
    pub is_custom: bool,
}

// Obstacle object representation in Rust
#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct ObstacleObject {
    pub id: u32,
    pub instance_ref: usize, // Store a reference to a JS object (index in pool)
    pub is_visible: bool,
    pub metadata: ObstacleMetadata,
    pub position: Vector3,
    pub rotation: Vector3,
}

// Main object pool class
#[wasm_bindgen]
pub struct ObstaclePool {
    pool: HashMap<ObstacleType, Vec<ObstacleObject>>,
    active_obstacles: Vec<ObstacleObject>,
    next_id: u32,
}

#[wasm_bindgen]
impl ObstaclePool {
    // Create a new pool
    #[wasm_bindgen(constructor)]
    pub fn new() -> ObstaclePool {
        init_panic_hook();
        
        // Initialize empty pools for each obstacle type
        let mut pool = HashMap::new();
        pool.insert(ObstacleType::Dodge, Vec::new());
        pool.insert(ObstacleType::Jump, Vec::new());
        pool.insert(ObstacleType::Slide, Vec::new());
        pool.insert(ObstacleType::Sponsor, Vec::new());
        pool.insert(ObstacleType::Question, Vec::new());
        pool.insert(ObstacleType::Hint, Vec::new());
        pool.insert(ObstacleType::Coin, Vec::new());
        
        ObstaclePool {
            pool,
            active_obstacles: Vec::new(),
            next_id: 0,
        }
    }
    
    // Add an obstacle to the pool
    #[wasm_bindgen]
    pub fn add_to_pool(&mut self, type_value: ObstacleType, instance_ref: usize, id: String, is_custom: bool) {
        let metadata = ObstacleMetadata {
            id,
            type_value,
            is_custom,
        };
        
        let obstacle = ObstacleObject {
            id: 0, // Will be assigned when activated
            instance_ref,
            is_visible: false,
            metadata,
            position: Vector3::new(0.0, 0.0, 0.0),
            rotation: Vector3::new(0.0, 0.0, 0.0),
        };
        
        if let Some(pool_vec) = self.pool.get_mut(&type_value) {
            pool_vec.push(obstacle);
        }
    }
    
    // Get an obstacle from the pool
    #[wasm_bindgen]
    pub fn get_instance(&mut self, type_value: ObstacleType) -> JsValue {
        let pool_vec = match self.pool.get_mut(&type_value) {
            Some(pool) => pool,
            None => {
                return JsValue::NULL;
            }
        };
        
        if pool_vec.is_empty() {
            return JsValue::NULL;
        }
        
        // Get a random index
        let index = if pool_vec.len() > 1 {
            rand::thread_rng().gen_range(0..pool_vec.len())
        } else {
            0
        };
        
        // Remove from pool
        let mut obstacle = pool_vec.remove(index);
        
        // Assign a new ID and mark as visible
        obstacle.id = self.next_id;
        self.next_id += 1;
        obstacle.is_visible = true;
        
        // Save to active obstacles
        self.active_obstacles.push(obstacle.clone());
        
        // Return as JS value
        serde_wasm_bindgen::to_value(&obstacle).unwrap_or(JsValue::NULL)
    }
    
    // Return an obstacle to the pool
    #[wasm_bindgen]
    pub fn return_to_pool(&mut self, id: u32) -> bool {
        let index = self.active_obstacles.iter().position(|o| o.id == id);
        
        if let Some(index) = index {
            let mut obstacle = self.active_obstacles.remove(index);
            
            // Reset properties
            obstacle.position.set(0.0, 0.0, 0.0);
            obstacle.rotation.set(0.0, 0.0, 0.0);
            obstacle.is_visible = false;
            
            // Add back to the pool
            if let Some(pool_vec) = self.pool.get_mut(&obstacle.metadata.type_value) {
                pool_vec.push(obstacle);
                return true;
            }
        }
        
        false
    }
    
    // Update an obstacle's position
    #[wasm_bindgen]
    pub fn update_position(&mut self, id: u32, x: f32, y: f32, z: f32) -> bool {
        if let Some(obstacle) = self.active_obstacles.iter_mut().find(|o| o.id == id) {
            obstacle.position.set(x, y, z);
            return true;
        }
        false
    }
    
    // Update an obstacle's rotation
    #[wasm_bindgen]
    pub fn update_rotation(&mut self, id: u32, x: f32, y: f32, z: f32) -> bool {
        if let Some(obstacle) = self.active_obstacles.iter_mut().find(|o| o.id == id) {
            obstacle.rotation.set(x, y, z);
            return true;
        }
        false
    }
    
    // Get all active obstacles
    #[wasm_bindgen]
    pub fn get_active_obstacles(&self) -> JsValue {
        serde_wasm_bindgen::to_value(&self.active_obstacles).unwrap_or(JsValue::NULL)
    }
    
    // Get pool size for a specific type
    #[wasm_bindgen]
    pub fn get_pool_size(&self, type_value: ObstacleType) -> usize {
        self.pool.get(&type_value).map_or(0, |v| v.len())
    }
    
    // Clear the pool
    #[wasm_bindgen]
    pub fn clear_pool(&mut self) {
        for pool in self.pool.values_mut() {
            pool.clear();
        }
        self.active_obstacles.clear();
        self.next_id = 0;
    }
    
    // Get obstacle by ID
    #[wasm_bindgen]
    pub fn get_obstacle_by_id(&self, id: u32) -> JsValue {
        if let Some(obstacle) = self.active_obstacles.iter().find(|o| o.id == id) {
            return serde_wasm_bindgen::to_value(obstacle).unwrap_or(JsValue::NULL);
        }
        JsValue::NULL
    }
}

// Helper function to convert JS enums to Rust enums
#[wasm_bindgen]
pub fn js_enum_to_obstacle_type(value: i32) -> ObstacleType {
    match value {
        0 => ObstacleType::Dodge,
        1 => ObstacleType::Jump,
        2 => ObstacleType::Slide,
        3 => ObstacleType::Sponsor,
        4 => ObstacleType::Question,
        5 => ObstacleType::Hint,
        6 => ObstacleType::Coin,
        _ => ObstacleType::Dodge, // Default
    }
}

// Initialize the module
#[wasm_bindgen(start)]
pub fn start() {
    init_panic_hook();
} 