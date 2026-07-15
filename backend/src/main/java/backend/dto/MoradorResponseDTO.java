package backend.dto;

public record MoradorResponseDTO(Long id, String nome, String cpf, String telefone, UnidadeResponseDTO unidade) {
}