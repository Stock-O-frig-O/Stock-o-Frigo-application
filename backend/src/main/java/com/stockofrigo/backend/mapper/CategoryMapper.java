package com.stockofrigo.backend.mapper;

import com.stockofrigo.backend.dto.CategoryDTO;
import com.stockofrigo.backend.model.Category;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface CategoryMapper {

  CategoryMapper INSTANCE = Mappers.getMapper(CategoryMapper.class);

  CategoryDTO convertToDTO(Category category);

  Category ConvertToEntity(CategoryDTO categoryDTO);
}
