package backend.controller;

import backend.dto.UnidadeRequestDTO;
import backend.dto.UnidadeResponseDTO;
import backend.service.UnidadeService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/unidades")
public class UnidadeController {

    private final UnidadeService unidadeService;

    public UnidadeController(UnidadeService unidadeService) {
        this.unidadeService = unidadeService;
    }

    @GetMapping
    public List<UnidadeResponseDTO> listarTodas() {
        return unidadeService.listarTodas();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public UnidadeResponseDTO criarNovaUnidade(@RequestBody UnidadeRequestDTO dto) {
        return unidadeService.criarNovaUnidade(dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void excluirUnidade(@PathVariable Long id) {
        unidadeService.excluirUnidade(id);
    }
}