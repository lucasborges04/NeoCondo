package backend.service;

import backend.dto.BlocoRequestDTO;
import backend.dto.BlocoResponseDTO;
import backend.model.Bloco;
import backend.repository.BlocoRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class BlocoService {

    private final BlocoRepository blocoRepository;

    public BlocoService(BlocoRepository blocoRepository) {
        this.blocoRepository = blocoRepository;
    }

    public List<BlocoResponseDTO> listarTodos() {
        List<Bloco> blocos = blocoRepository.findAll();

        return blocos.stream()
                .map(bloco -> new BlocoResponseDTO(bloco.getId(), bloco.getNome()))
                .collect(Collectors.toList());
    }

    public BlocoResponseDTO criarNovoBloco(BlocoRequestDTO dto) {
        Bloco blocoParaSalvar = new Bloco();

        blocoParaSalvar.setNome(dto.nome());

        // Manda o Repository salvar no banco (o Hibernate gera o ID aqui)
        Bloco blocoSalvo = blocoRepository.save(blocoParaSalvar);

        // Coloca a Entidade salva dentro do envelope de resposta (ResponseDTO)
        return new BlocoResponseDTO(blocoSalvo.getId(), blocoSalvo.getNome());
    }
}