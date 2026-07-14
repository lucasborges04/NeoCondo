package backend.controller;

import backend.dto.BlocoRequestDTO;
import backend.dto.BlocoResponseDTO;
import backend.service.BlocoService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/blocos")
public class BlocoController {

    private final BlocoService blocoService;

    public BlocoController(BlocoService blocoService) {
        this.blocoService = blocoService;
    }

    @GetMapping
    public List<BlocoResponseDTO> listarTodos() {
        return blocoService.listarTodos();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public BlocoResponseDTO criarNovoBloco(@RequestBody BlocoRequestDTO dto) {
        return blocoService.criarNovoBloco(dto);
    }
}