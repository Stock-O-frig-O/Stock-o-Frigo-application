package com.stockofrigo.backend.service;

import com.stockofrigo.backend.dto.CategoryDTO;
import com.stockofrigo.backend.mapper.CategoryMapper;
import com.stockofrigo.backend.model.Category;
import com.stockofrigo.backend.repository.CategoryRepository;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository){
        this.categoryRepository = categoryRepository;
    }

    public List<CategoryDTO> getAllCategories(){
        List<Category> categories = categoryRepository.findAll();
        if(categories.isEmpty()){
            return Collections.emptyList();
        }
        return categories.stream().map(CategoryMapper.INSTANCE::convertToDTO).toList();
    }

    public CategoryDTO getCategoryById(Long id){
        Category category = this.categoryRepository.findById(id).orElse(null);

        if (category == null) {
            return null;
        }

        return CategoryMapper.INSTANCE.convertToDTO(category);
    }

    public CategoryDTO updateCategory(Long id, Category category){
        Category updatedCategory = categoryRepository.findById(id).orElse(null);
        if (updatedCategory == null) {
            return null;
        }
        updatedCategory.setName(category.getName());
        return CategoryMapper.INSTANCE.convertToDTO(categoryRepository.save(updatedCategory));
    }

    public CategoryDTO createCategory(Category category){
        Category newCategory = new Category();
        newCategory.setName(category.getName());

        return CategoryMapper.INSTANCE.convertToDTO(categoryRepository.save(newCategory));
    }

    public boolean deleteCategory(Long id){
        Category category = this.categoryRepository.findById(id).orElse(null);
        if (category == null) {
            return false;
        }
        categoryRepository.deleteById(id);
        return true;
    }
}
