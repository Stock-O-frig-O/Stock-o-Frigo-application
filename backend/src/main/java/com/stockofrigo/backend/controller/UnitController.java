package com.stockofrigo.backend.controller;

import com.stockofrigo.backend.dto.UnitDTO;
import com.stockofrigo.backend.model.Unit;
import com.stockofrigo.backend.service.UnitService;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/units")
public class UnitController {

  private UnitService unitService;

  public UnitController(UnitService unitService) {
    this.unitService = unitService;
  }

  @GetMapping
  public ResponseEntity<List<UnitDTO>> findAll() {
    List<UnitDTO> allUnits = unitService.findAllUnit();
    if (allUnits.isEmpty()) {
      return ResponseEntity.noContent().build();
    }
    return ResponseEntity.ok(allUnits);
  }

  @GetMapping("/{id}")
  public ResponseEntity<UnitDTO> findById(@PathVariable Long id) {
    UnitDTO unit = unitService.findUnitById(id);
    if (unit == null) {
      return ResponseEntity.notFound().build();
    }

    return ResponseEntity.ok(unit);
  }

  @PostMapping
  public ResponseEntity<UnitDTO> createUnit(@RequestBody Unit unit) {
    UnitDTO savedUnit = unitService.createUnit(unit);
    return ResponseEntity.ok(savedUnit);
  }
}
