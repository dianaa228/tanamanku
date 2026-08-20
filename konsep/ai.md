{
"project": {
"name": "Tanamanku",
"type": "Urban Gardening Marketplace & Management Platform",
"version": "1.0.0",
"architecture": "Monorepo",
"language": "Indonesian",
"market": "Indonesia"
},

"technology_stack": {
"backend": {
"framework": "Laravel",
"language": "PHP",
"architecture": "REST API",
"authentication": "Laravel Sanctum",
"orm": "Eloquent"
},

```
"web": {
  "framework": "React",
  "css": "Tailwind CSS",
  "bundler": "Vite"
},

"mobile": {
  "framework": "Flutter",
  "platform": [
    "Android",
    "iOS"
  ]
},

"database": {
  "engine": "MySQL"
}
```

},

"root_structure": {
"TANAMANKU": {
"files": [
"README.md",
".gitignore",
"docker-compose.yml"
],

```
  "directories": {
    "backend": {
      "description": "Laravel REST API",

      "structure": {
        "app": {
          "Http": {
            "Controllers": {
              "Api": {
                "V1": {
                  "AuthController.php": "Authentication",
                  "UserController.php": "User management",
                  "CategoryController.php": "Category management",
                  "ProductController.php": "Product marketplace",
                  "StoreController.php": "Store management",
                  "CartController.php": "Shopping cart",
                  "OrderController.php": "Orders",
                  "PaymentController.php": "Payments",
                  "ShipmentController.php": "Shipping",
                  "ReviewController.php": "Product reviews",
                  "PlantSpeciesController.php": "Plant master data",
                  "MyGardenController.php": "User garden",
                  "PlantGrowthController.php": "Growth tracking",
                  "PlantCareController.php": "Plant care",
                  "PlantReminderController.php": "Care reminders",
                  "PlantFinderController.php": "Plant recommendation",
                  "PlantDiagnosisController.php": "Plant diagnosis",
                  "CommunityController.php": "Community posts",
                  "CommentController.php": "Comments",
                  "PlantExchangeController.php": "Plant exchange",
                  "ServiceController.php": "Gardening services",
                  "ServiceOrderController.php": "Service booking",
                  "NotificationController.php": "Notifications"
                }
              }
            },

            "Requests": {
              "Auth": {},
              "Product": {},
              "Cart": {},
              "Order": {},
              "Garden": {},
              "Plant": {},
              "Community": {},
              "Service": {}
            },

            "Resources": {
              "UserResource.php": "User API response",
              "ProductResource.php": "Product API response",
              "CategoryResource.php": "Category API response",
              "StoreResource.php": "Store API response",
              "OrderResource.php": "Order API response",
              "PlantResource.php": "Plant API response",
              "GardenResource.php": "Garden API response",
              "CommunityPostResource.php": "Community API response"
            }
          },

          "Models": {
            "User.php": {},
            "Address.php": {},

            "Store.php": {},
            "Category.php": {},
            "Product.php": {},
            "ProductImage.php": {},
            "ProductVariant.php": {},
            "Inventory.php": {},

            "Cart.php": {},
            "CartItem.php": {},

            "Order.php": {},
            "OrderItem.php": {},
            "Payment.php": {},
            "Shipment.php": {},
            "Review.php": {},

            "PlantSpecies.php": {},
            "UserPlant.php": {},
            "PlantPhoto.php": {},
            "PlantGrowthLog.php": {},
            "PlantCareLog.php": {},
            "PlantReminder.php": {},
            "PlantDiagnosis.php": {},

            "Favorite.php": {},

            "Post.php": {},
            "PostImage.php": {},
            "Comment.php": {},
            "PostLike.php": {},
            "Report.php": {},

            "PlantListing.php": {},
            "PlantExchange.php": {},

            "Service.php": {},
            "ServiceOrder.php": {},

            "Notification.php": {}
          },

          "Services": {
            "AuthService.php": "Authentication business logic",
            "ProductService.php": "Product business logic",
            "CartService.php": "Cart business logic",
            "OrderService.php": "Order and checkout business logic",
            "PaymentService.php": "Payment processing",
            "InventoryService.php": "Stock management",
            "PlantFinderService.php": "Plant recommendation engine",
            "PlantDiagnosisService.php": "Plant diagnosis rules",
            "GardenService.php": "My Garden business logic",
            "ReminderService.php": "Plant reminder management",
            "CommunityService.php": "Community business logic",
            "PlantExchangeService.php": "Plant exchange logic",
            "ServiceBookingService.php": "Gardening service booking"
          },

          "Policies": {
            "ProductPolicy.php": {},
            "StorePolicy.php": {},
            "OrderPolicy.php": {},
            "UserPlantPolicy.php": {},
            "PostPolicy.php": {},
            "ServicePolicy.php": {}
          },

          "Jobs": {
            "ProcessPlantReminder.php": {},
            "SendOrderNotification.php": {},
            "UpdateInventory.php": {}
          },

          "Notifications": {
            "OrderNotification.php": {},
            "PlantCareNotification.php": {},
            "CommunityNotification.php": {}
          }
        },

        "database": {
          "migrations": {
            "description": "All database schema changes",
            "groups": [
              "users",
              "stores",
              "catalog",
              "commerce",
              "garden",
              "community",
              "services",
              "notifications"
            ]
          },

          "seeders": {
            "DatabaseSeeder.php": {},
            "RoleSeeder.php": {},
            "CategorySeeder.php": {},
            "PlantSpeciesSeeder.php": {},
            "AdminSeeder.php": {}
          },

          "factories": {
            "UserFactory.php": {},
            "ProductFactory.php": {},
            "PlantSpeciesFactory.php": {},
            "PostFactory.php": {}
          }
        },

        "routes": {
          "api.php": "Main API routes",
          "console.php": "Scheduler and console commands"
        },

        "tests": {
          "Feature": {
            "Auth": {},
            "Marketplace": {},
            "Cart": {},
            "Order": {},
            "Garden": {},
            "Community": {}
          },

          "Unit": {
            "Services": {},
            "Rules": {}
          }
        }
      }
    },

    "web": {
      "description": "React + Tailwind CSS web application",

      "structure": {
        "src": {
          "assets": {},

          "components": {
            "ui": {
              "Button",
              "Input",
              "Modal",
              "Card",
              "Badge",
              "Dropdown",
              "Pagination",
              "Loading",
              "EmptyState"
            },

            "layout": {
              "Navbar",
              "Sidebar",
              "Footer",
              "MobileNavigation"
            },

            "product": {
              "ProductCard",
              "ProductGrid",
              "ProductFilter",
              "ProductSearch",
              "ProductGallery"
            },

            "garden": {
              "PlantCard",
              "PlantStatus",
              "GrowthChart",
              "CareReminder"
            }
          },

          "pages": {
            "auth": {
              "Login",
              "Register",
              "ForgotPassword"
            },

            "customer": {
              "Home",
              "Explore",
              "ProductDetail",
              "Cart",
              "Checkout",
              "Orders",
              "OrderDetail",
              "MyGarden",
              "PlantDetail",
              "PlantFinder",
              "PlantDiagnosis",
              "Community",
              "Profile"
            },

            "seller": {
              "Dashboard",
              "Products",
              "CreateProduct",
              "EditProduct",
              "Orders",
              "Inventory",
              "Sales"
            },

            "admin": {
              "Dashboard",
              "Users",
              "Stores",
              "Categories",
              "Products",
              "Orders",
              "Payments",
              "Community",
              "Reports",
              "Settings"
            }
          },

          "services": {
            "api": {
              "client.js": "Axios/API client",
              "auth.js": "Authentication API",
              "products.js": "Product API",
              "cart.js": "Cart API",
              "orders.js": "Order API",
              "garden.js": "Garden API",
              "community.js": "Community API"
            }
          },

          "hooks": {},
          "context": {},
          "store": {},
          "utils": {},
          "types": {},

          "router": {
            "index.jsx": "Application routing"
          },

          "App.jsx": {},
          "main.jsx": {}
        }
      }
    },

    "mobile": {
      "description": "Flutter customer application",

      "structure": {
        "lib": {
          "core": {
            "config": {},
            "constants": {},
            "network": {},
            "storage": {},
            "theme": {},
            "utils": {}
          },

          "models": {
            "user.dart": {},
            "product.dart": {},
            "category.dart": {},
            "cart.dart": {},
            "order.dart": {},
            "plant.dart": {},
            "garden.dart": {},
            "reminder.dart",
            "post.dart"
          },

          "services": {
            "api_service.dart": {},
            "auth_service.dart": {},
            "product_service.dart": {},
            "cart_service.dart": {},
            "order_service.dart": {},
            "garden_service.dart": {},
            "community_service.dart": {}
          },

          "features": {
            "auth": {
              "pages": {},
              "widgets": {},
              "controllers": {}
            },

            "home": {
              "pages": {},
              "widgets": {}
            },

            "marketplace": {
              "pages": {},
              "widgets": {},
              "controllers": {}
            },

            "cart": {
              "pages": {},
              "widgets": {}
            },

            "checkout": {
              "pages": {},
              "widgets": {}
            },

            "orders": {
              "pages": {},
              "widgets": {}
            },

            "my_garden": {
              "pages": {},
              "widgets": {},
              "controllers": {}
            },

            "plant_finder": {
              "pages": {},
              "widgets": {},
              "controllers": {}
            },

            "plant_diagnosis": {
              "pages": {},
              "widgets": {},
              "controllers": {}
            },

            "community": {
              "pages": {},
              "widgets": {},
              "controllers": {}
            },

            "profile": {
              "pages": {},
              "widgets": {}
            }
          },

          "widgets": {
            "app_button.dart": {},
            "app_card.dart": {},
            "app_text_field.dart": {},
            "product_card.dart": {},
            "plant_card.dart": {},
            "loading_widget.dart": {},
            "error_widget.dart": {}
          },

          "routes": {
            "app_routes.dart": {}
          },

          "main.dart": {}
        },

        "test": {
          "unit": {},
          "widget": {},
          "integration": {}
        }
      }
    },

    "docs": {
      "description": "Project documentation",
      "files": [
        "API.md",
        "DATABASE.md",
        "ARCHITECTURE.md",
        "INSTALLATION.md",
        "DEPLOYMENT.md"
      ]
    }
  }
}
```

},

"system_modules": {
"authentication": {
"backend": true,
"web": true,
"mobile": true
},

```
"marketplace": {
  "backend": true,
  "web": true,
  "mobile": true
},

"cart": {
  "backend": true,
  "web": true,
  "mobile": true
},

"checkout": {
  "backend": true,
  "web": true,
  "mobile": true
},

"orders": {
  "backend": true,
  "web": true,
  "mobile": true
},

"my_garden": {
  "backend": true,
  "web": true,
  "mobile": true
},

"plant_care": {
  "backend": true,
  "web": true,
  "mobile": true
},

"plant_finder": {
  "backend": true,
  "web": true,
  "mobile": true
},

"plant_diagnosis": {
  "backend": true,
  "web": true,
  "mobile": true
},

"community": {
  "backend": true,
  "web": true,
  "mobile": true
},

"plant_exchange": {
  "backend": true,
  "web": true,
  "mobile": true
},

"services": {
  "backend": true,
  "web": true,
  "mobile": true
},

"admin": {
  "backend": true,
  "web": true,
  "mobile": false
},

"seller": {
  "backend": true,
  "web": true,
  "mobile": false
}
```

},

"database_domains": {
"identity": [
"users",
"addresses"
],

```
"marketplace": [
  "stores",
  "categories",
  "products",
  "product_images",
  "product_variants",
  "inventories"
],

"commerce": [
  "carts",
  "cart_items",
  "orders",
  "order_items",
  "payments",
  "shipments",
  "reviews",
  "favorites"
],

"garden": [
  "plant_species",
  "user_plants",
  "plant_photos",
  "plant_growth_logs",
  "plant_care_logs",
  "plant_reminders",
  "plant_diagnoses"
],

"community": [
  "posts",
  "post_images",
  "comments",
  "post_likes",
  "reports"
],

"exchange": [
  "plant_listings",
  "plant_exchanges"
],

"services": [
  "services",
  "service_orders"
],

"system": [
  "notifications"
]
```

},

"api_architecture": {
"base": "/api/v1",

```
"groups": {
  "auth": "/auth",
  "products": "/products",
  "categories": "/categories",
  "stores": "/stores",
  "cart": "/cart",
  "orders": "/orders",
  "garden": "/my-garden",
  "plant_finder": "/plant-finder",
  "plant_diagnosis": "/plant-diagnosis",
  "community": "/community",
  "exchange": "/plant-exchange",
  "services": "/services",
  "notifications": "/notifications"
},

"response_format": {
  "success": {
    "success": true,
    "message": "Success",
    "data": {}
  },

  "error": {
    "success": false,
    "message": "Error",
    "errors": {}
  }
}
```

},

"frontend_architecture": {
"customer_mobile": "Flutter",
"customer_web": "React",
"admin_web": "React",
"seller_web": "React",
"backend": "Laravel REST API",

```
"rule": "Frontend hanya bertanggung jawab terhadap UI, state, interaction, dan API consumption. Business logic utama berada di backend."
```

},

"data_flow": {
"customer": [
"Flutter",
"Laravel API",
"MySQL"
],

```
"web_customer": [
  "React",
  "Laravel API",
  "MySQL"
],

"seller": [
  "React",
  "Laravel API",
  "MySQL"
],

"admin": [
  "React",
  "Laravel API",
  "MySQL"
]
```

},

"security_architecture": {
"authentication": "Laravel Sanctum",
"authorization": [
"Middleware",
"Policies",
"Role",
"Permission",
"Ownership Check"
],

```
"rules": [
  "Never trust user_id from client.",
  "Never trust price calculated by client.",
  "Never trust order total from client.",
  "Never expose passwords.",
  "Never expose tokens.",
  "Validate every request.",
  "Validate file uploads.",
  "Use rate limiting.",
  "Use database transactions for checkout."
]
```

},

"business_logic_location": {
"controllers": "Request handling only",
"requests": "Validation",
"services": "Business logic",
"models": "Relationships and persistence",
"policies": "Authorization",
"resources": "API response transformation",
"jobs": "Asynchronous processing",
"notifications": "User notification logic"
},

"development_order": [
{
"phase": 1,
"name": "Project Foundation",
"modules": [
"Laravel",
"React",
"Flutter",
"MySQL",
"API"
]
},

```
{
  "phase": 2,
  "name": "Authentication",
  "modules": [
    "Users",
    "Roles",
    "Login",
    "Register",
    "Sanctum"
  ]
},

{
  "phase": 3,
  "name": "Marketplace",
  "modules": [
    "Categories",
    "Stores",
    "Products",
    "Inventory",
    "Search"
  ]
},

{
  "phase": 4,
  "name": "Commerce",
  "modules": [
    "Cart",
    "Checkout",
    "Orders",
    "Payments",
    "Shipment",
    "Reviews"
  ]
},

{
  "phase": 5,
  "name": "My Garden",
  "modules": [
    "Plant Species",
    "User Plants",
    "Plant Photos",
    "Growth",
    "Care Logs"
  ]
},

{
  "phase": 6,
  "name": "Plant Care",
  "modules": [
    "Reminders",
    "Watering",
    "Fertilizing",
    "Repotting",
    "Notifications"
  ]
},

{
  "phase": 7,
  "name": "Smart Plant",
  "modules": [
    "Plant Finder",
    "Rule Engine",
    "Plant Diagnosis"
  ]
},

{
  "phase": 8,
  "name": "Community",
  "modules": [
    "Posts",
    "Comments",
    "Likes",
    "Reports"
  ]
},

{
  "phase": 9,
  "name": "Seller",
  "modules": [
    "Seller Dashboard",
    "Product Management",
    "Inventory",
    "Order Management",
    "Sales"
  ]
},

{
  "phase": 10,
  "name": "Services",
  "modules": [
    "Service",
    "Booking",
    "Schedule",
    "Provider"
  ]
},

{
  "phase": 11,
  "name": "Plant Exchange",
  "modules": [
    "Plant Listing",
    "Selling",
    "Exchange",
    "Exchange Request"
  ]
},

{
  "phase": 12,
  "name": "Testing & Production",
  "modules": [
    "Unit Test",
    "Feature Test",
    "API Test",
    "Security Test",
    "Deployment"
  ]
}
```

],

"mvp_scope": {
"must_have": [
"Authentication",
"Product Marketplace",
"Category",
"Search",
"Product Detail",
"Cart",
"Checkout",
"Orders",
"My Garden",
"Plant Care Reminder"
],

```
"next_version": [
  "Plant Finder",
  "Plant Diagnosis",
  "Seller Dashboard",
  "Reviews",
  "Notifications"
],

"future": [
  "Community",
  "Nursery",
  "Plant Exchange",
  "Gardening Services",
  "Subscription",
  "Loyalty System",
  "Advanced Analytics"
]
```

},

"important_rules": [
"Backend is the source of truth.",
"Frontend must never contain critical business logic only.",
"All database changes must use migrations.",
"All API input must be validated.",
"All protected resources must check authorization.",
"All ownership-sensitive resources must check ownership.",
"Checkout must use database transaction.",
"Stock must be checked server-side.",
"Order totals must be calculated server-side.",
"Passwords must be hashed.",
"Sensitive configuration must be stored in environment variables.",
"Do not duplicate business logic between React and Flutter.",
"React and Flutter consume the same Laravel API.",
"Do not create duplicate models or tables.",
"Use feature-based organization for frontend modules.",
"Keep controllers thin.",
"Use service classes for complex business logic.",
"Write tests for important business rules."
]
}
