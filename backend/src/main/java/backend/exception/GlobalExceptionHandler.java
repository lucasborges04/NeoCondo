package backend.exception;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // Captura as falhas do DTO (@NotBlank, @CPF, etc.)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> tratarErrosDeValidacao(MethodArgumentNotValidException ex) {
        Map<String, String> erros = new HashMap<>();

        // Pega todos os campos que falharam e suas mensagens
        for (FieldError erro : ex.getBindingResult().getFieldErrors()) {
            erros.put(erro.getField(), erro.getDefaultMessage());
        }

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(erros);
    }

    // 2. Captura os gritos de socorro do Banco de Dados (Ex: unique=true ou Foreign Key)
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<Map<String, String>> tratarErrosDeBancoDeDados(DataIntegrityViolationException ex) {
        Map<String, String> erro = new HashMap<>();

        String mensagemExcecao = ex.getMessage() != null ? ex.getMessage().toLowerCase() : "";

        if (mensagemExcecao.contains("cpf")) {
            erro.put("erro", "Este CPF já está cadastrado no sistema.");
        }
        else if (mensagemExcecao.contains("constraint") || mensagemExcecao.contains("foreign key") || mensagemExcecao.contains("fk_")) {
            erro.put("erro", "Não é possível excluir este registro, pois existem outros dados vinculados a ele.");
        }
        else {
            erro.put("erro", "Ocorreu um erro de integridade no banco de dados.");
        }

        return ResponseEntity.status(HttpStatus.CONFLICT).body(erro);
    }
}