package backend.controller;

import backend.dto.MoradorRequestDTO;
import backend.dto.MoradorResponseDTO;
import backend.service.MoradorService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/moradores")
public class MoradorController {

    private final MoradorService moradorService;

    public MoradorController(MoradorService moradorService) {
        this.moradorService = moradorService;
    }

    @GetMapping
    public List<MoradorResponseDTO> listarTodos() {
        return moradorService.listarTodos();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public MoradorResponseDTO criarNovoMorador(@RequestBody MoradorRequestDTO dto) {
        return moradorService.criarNovoMorador(dto);
    }
}