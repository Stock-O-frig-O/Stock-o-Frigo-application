package com.stockofrigo.backend.service;

import com.stockofrigo.backend.dto.UnitDTO;
import com.stockofrigo.backend.mapper.UnitMapper;
import com.stockofrigo.backend.model.Unit;
import com.stockofrigo.backend.repository.UnitRepository;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;

@Service
public class UnitService {

  private UnitRepository unitRepository;

  public UnitService(UnitRepository unitRepository) {
    this.unitRepository = unitRepository;
  }

  public List<UnitDTO> findAllUnit() {
    List<Unit> allUnits = this.unitRepository.findAll();
    if (allUnits == null || allUnits.isEmpty()) {
      return Collections.emptyList();
    }

    return allUnits.stream()
        .map(UnitMapper.INSTANCE::convertToUnitDto)
        .collect(Collectors.toList());
  }

  public UnitDTO findUnitById(Long id) {
    Unit unit = this.unitRepository.findById(id).orElse(null);
    if (unit == null) {
      return null;
    }
    return UnitMapper.INSTANCE.convertToUnitDto(unit);
  }
}
