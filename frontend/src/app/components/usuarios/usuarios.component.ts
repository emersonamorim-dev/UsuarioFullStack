import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FormControl, FormGroup } from '@angular/forms';

import { UsuariosService } from './../../usuarios.service';
import { Usuario } from 'src/app/Usuario';


@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {
  formulario: any;
  tituloFormulario!: string;
  usuarios!: Usuario[];
  nomeUsuario!: string;
  usuarioId!: number;

  visibilidadeTabela: boolean = true;
  visibilidadeFormulario: boolean = false;

  modalRef!: BsModalRef;

  constructor(private usuariosService: UsuariosService,
    private modalService: BsModalService) {}

  ngOnInit(): void {
    this.usuariosService.PegarTodos().subscribe((resultado) => {
      this.usuarios = resultado;
    });
  }

  ExibirFormularioCadastro(): void {
    this.visibilidadeTabela = false;
    this.visibilidadeFormulario = true;
    this.tituloFormulario = 'Novo Usuário';
    this.formulario = new FormGroup({
      nome: new FormControl(null),
      sobrenome: new FormControl(null),
      idade: new FormControl(null),
      profissao: new FormControl(null),
    });
  }

  ExibirFormularioAtualizacao(usuarioId: number): void {
    this.visibilidadeTabela = false;
    this.visibilidadeFormulario = true;

    this.usuariosService.PegarPeloId(usuarioId).subscribe((resultado) => {
      this.tituloFormulario = `Atualizar ${resultado.nome} ${resultado.sobrenome}`;

      this.formulario = new FormGroup({
        usuarioId: new FormControl(resultado.usuarioId),
        nome: new FormControl(resultado.nome),
        sobrenome: new FormControl(resultado.sobrenome),
        idade: new FormControl(resultado.idade),
        profissao: new FormControl(resultado.profissao),
      });
    });
  }

  EnviarFormulario(): void {
    const usuario: Usuario = this.formulario.value;

    if (usuario.usuarioId > 0) {
      this.usuariosService.AtualizarUsuario(usuario).subscribe((resultado) => {
        this.visibilidadeFormulario = false;
        this.visibilidadeTabela = true;
        alert('Usuário atualizado com sucesso');
        this.usuariosService.PegarTodos().subscribe((registros) => {
          this.usuarios = registros;
        });
      });
    } else {
      this.usuariosService.SalvarUsuario(usuario).subscribe((resultado) => {
        this.visibilidadeFormulario = false;
        this.visibilidadeTabela = true;
        alert('Usuário inserido com sucesso');
        this.usuariosService.PegarTodos().subscribe((registros) => {
          this.usuarios = registros;
        });
      });
    }
  }

  Voltar(): void {
    this.visibilidadeTabela = true;
    this.visibilidadeFormulario = false;
  }

  ExibirConfirmacaoExclusao(usuarioId: number, nomeUsuario: string, conteudoModal: TemplateRef<any>): void {
    this.modalRef = this.modalService.show(conteudoModal);
    this.usuarioId = usuarioId;
    this.nomeUsuario = nomeUsuario;
  }

  ExcluirUsuario(usuarioaId: any){
    this.usuariosService.ExcluirUsuario(usuarioaId).subscribe(resultado => {
      this.modalRef.hide();
      alert('Usuário excluído com sucesso');
      this.usuariosService.PegarTodos().subscribe(registros => {
        this.usuarios = registros;
      });
    });
  }
}
