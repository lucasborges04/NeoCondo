package backend.service;

import backend.dto.BlocoResponseDTO;
import backend.dto.UnidadeRequestDTO;
import backend.dto.UnidadeResponseDTO;
import backend.model.Bloco;
import backend.model.Unidade;
import backend.repository.BlocoRepository;
import backend.repository.UnidadeRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UnidadeService {

    private final UnidadeRepository unidadeRepository;
    private final BlocoRepository blocoRepository;

    public UnidadeService(UnidadeRepository unidadeRepository, BlocoRepository blocoRepository) {
        this.unidadeRepository = unidadeRepository;
        this.blocoRepository = blocoRepository;
    }

    public List<UnidadeResponseDTO> listarTodas() {
        List<Unidade> unidades = unidadeRepository.findAll();

        return unidades.stream()
                .map(this::converterParaResponseDTO)
                .collect(Collectors.toList());
    }

    public UnidadeResponseDTO criarNovaUnidade(UnidadeRequestDTO dto) {
        // Verifica se o bloco informado realmente existe
        Bloco blocoVinculado = blocoRepository.findById(dto.bloco().id())
                .orElseThrow(() -> new RuntimeException("Erro: Bloco não encontrado no banco de dados."));

        Unidade unidadeParaSalvar = new Unidade();
        unidadeParaSalvar.setNumero(dto.numero());
        unidadeParaSalvar.setBloco(blocoVinculado); // Associa o objeto Bloco validado

        Unidade unidadeSalva = unidadeRepository.save(unidadeParaSalvar);

        return converterParaResponseDTO(unidadeSalva);
    }

    public void excluirUnidade(Long id) {
        if (!unidadeRepository.existsById(id)) {
            throw new RuntimeException("Unidade não encontrada para exclusão.");
        }
        unidadeRepository.deleteById(id);
    }

    private UnidadeResponseDTO converterParaResponseDTO(Unidade unidade) {
        BlocoResponseDTO blocoDTO = new BlocoResponseDTO(
                unidade.getBloco().getId(),
                unidade.getBloco().getNome()
        );
        return new UnidadeResponseDTO(unidade.getId(), unidade.getNumero(), blocoDTO);
    }
}