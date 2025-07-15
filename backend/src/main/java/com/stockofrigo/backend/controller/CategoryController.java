package com.stockofrigo.backend.controller;

import com.stockofrigo.backend.dto.CategoryDTO;
import com.stockofrigo.backend.model.Category;
import com.stockofrigo.backend.service.CategoryService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/categories")
public class CategoryController {
    private CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @GetMapping
    public ResponseEntity<List<CategoryDTO>> getAllCategories(){
        List<CategoryDTO> categories = this.categoryService.getAllCategories();
        if (categories.isEmpty()){
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(categories);
    }

    @GetMapping("/{id}")
    ResponseEntity<CategoryDTO> getCategoryById(@PathVariable Long id){
        CategoryDTO category = this.categoryService.getCategoryById(id);
        if (category == null){
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(category);
    }

    @PutMapping("/{id}")
    ResponseEntity<CategoryDTO> updateCategory(@PathVariable Long id, @RequestBody CategoryDTO category){
        CategoryDTO updatedCategory = this.categoryService.updateCategory(id, category);
        if (updatedCategory == null){
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updatedCategory);
    }

    @PostMapping
    ResponseEntity<CategoryDTO> createCategory(@RequestBody CategoryDTO category){
        CategoryDTO newCategory = this.categoryService.createCategory(category);
        return ResponseEntity.status(HttpStatus.CREATED).body(newCategory);
    }

    @DeleteMapping("/{id}")
    ResponseEntity<Boolean> deleteCategory(@PathVariable Long id){
        if(this.categoryService.deleteCategory(id)){
            return ResponseEntity.noContent().build();
        }else {
            return ResponseEntity.notFound().build();

        }
    }


}



