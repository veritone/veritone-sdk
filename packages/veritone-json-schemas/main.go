package main

import (
	"fmt"
	"log"

	"github.com/kaptinlin/jsonschema"
)

type User struct {
	Name    string `json:"name"`
	Age     int    `json:"age"`
	Country string `json:"country"`
	Active  bool   `json:"active"`
}

func main() {
	fmt.Println("Hello, Veritone JSON Schemas!")

	// Compile schema
	compiler := jsonschema.NewCompiler()
	schema, err := compiler.Compile([]byte(`{
    "type": "object",
    "properties": {
      "name": {"type": "string", "minLength": 1},
      "age": {"type": "integer", "minimum": 0}
    },
    "required": ["name"]
  }`))
	if err != nil {
		log.Fatal(err)
	}

	// Recommended workflow: validate first, then unmarshal
	data := []byte(`{"name": "John", "age": 25}`)

	// Step 1: Validate
	result := schema.Validate(data)
	if result.IsValid() {
		fmt.Println("✅ Valid")
		// Step 2: Unmarshal validated data
		var user User
		err := schema.Unmarshal(&user, data)
		if err != nil {
			log.Fatal(err)
		}
	} else {
		fmt.Println("❌ Invalid")
		for field, err := range result.Errors {
			fmt.Printf("- %s: %s\n", field, err.Message)
		}
	}
}
