package backend.service;

import backend.dto.*;
import backend.model.Morador;
import backend.model.Unidade;
import backend.repository.MoradorRepository;
import backend.repository.UnidadeRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MoradorService {

    private final MoradorRepository moradorRepository;
    private final UnidadeRepository unidadeRepository;

    public MoradorService(MoradorRepository moradorRepository, UnidadeRepository unidadeRepository) {
        this.moradorRepository = moradorRepository;
        this.unidadeRepository = unidadeRepository;
    }

    public List<MoradorResponseDTO> listarTodos() {
        return moradorRepository.findAll().stream()
                .map(this::converterParaResponseDTO)
                .collect(Collectors.toList());
    }

    public MoradorResponseDTO criarNovoMorador(MoradorRequestDTO dto) {
        Unidade unidadeVinculada = unidadeRepository.findById(dto.unidade().id())
                .orElseThrow(() -> new RuntimeException("Erro: Unidade não encontrada no banco de dados."));

        Morador morador = new Morador();
        morador.setNome(dto.nome());
        morador.setCpf(dto.cpf());
        morador.setTelefone(dto.telefone());
        morador.setUnidade(unidadeVinculada);

        Morador moradorSalvo = moradorRepository.save(morador);
        return converterParaResponseDTO(moradorSalvo);
    }

    public void excluirMorador(Long id) {
        if (!moradorRepository.existsById(id)) {
            throw new RuntimeException("Morador não encontrado para exclusão.");
        }
        moradorRepository.deleteById(id);
    }

    // Metodo auxiliar para montar a árvore completa de DTOs (Morador -> Unidade -> Bloco)
    private MoradorResponseDTO converterParaResponseDTO(Morador morador) {
        BlocoResponseDTO blocoDTO = new BlocoResponseDTO(
                morador.getUnidade().getBloco().getId(),
                morador.getUnidade().getBloco().getNome()
        );

        UnidadeResponseDTO unidadeDTO = new UnidadeResponseDTO(
                morador.getUnidade().getId(),
                morador.getUnidade().getNumero(),
                blocoDTO
        );

        return new MoradorResponseDTO(
                morador.getId(),
                morador.getNome(),
                morador.getCpf(),
                morador.getTelefone(),
                unidadeDTO
        );
    }
}