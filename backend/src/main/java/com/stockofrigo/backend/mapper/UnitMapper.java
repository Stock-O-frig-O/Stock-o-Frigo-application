package com.stockofrigo.backend.mapper;

import com.stockofrigo.backend.dto.UnitDTO;
import com.stockofrigo.backend.model.Unit;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface UnitMapper {
  UnitMapper INSTANCE = Mappers.getMapper(UnitMapper.class);

  UnitDTO convertToUnitDto(Unit unit);

  Unit convertToUnit(UnitDTO unitDTO);
}
