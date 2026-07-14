package backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "unidades")
public class Unidade {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Usamos String para permitir números como "101A", "Térreo", "Casa 5"
    @Column(nullable = false, length = 20)
    private String numero;

    @ManyToOne
    @JoinColumn(name = "bloco_id", nullable = false)
    private Bloco bloco;

    public Unidade() {
    }

    public Unidade(String numero, Bloco bloco) {
        this.numero = numero;
        this.bloco = bloco;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNumero() {
        return numero;
    }

    public void setNumero(String numero) {
        this.numero = numero;
    }

    public Bloco getBloco() {
        return bloco;
    }

    public void setBloco(Bloco bloco) {
        this.bloco = bloco;
    }
}