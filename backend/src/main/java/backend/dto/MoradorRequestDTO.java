package backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import org.hibernate.validator.constraints.br.CPF;

public record MoradorRequestDTO(

        @NotBlank(message = "O nome não pode estar em branco.")
        String nome,

        @NotBlank(message = "O CPF é obrigatório.")
        @CPF(message = "O CPF informado é inválido.")
        String cpf,

        // aceita formatos como: 11987654321, (11) 98765-4321, etc.
        @Pattern(regexp = "^\\(?\\d{2}\\)?\\s?\\d{4,5}-?\\d{4}$", message = "O telefone deve estar em um formato válido. Ex: (11) 98765-4321")
        String telefone,

        @NotNull(message = "A unidade de residência é obrigatória.")
        UnidadeIdDTO unidade
) {
}