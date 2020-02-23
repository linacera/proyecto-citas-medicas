import { Column, Entity, Index, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { DetalleHistorialEntity } from '../detalle-historial/detalle-historial.entity';
import { PacienteEntity } from '../paciente/paciente.entity';

@Entity()

export class HistorialEntity{
  @PrimaryGeneratedColumn({
    type: 'int',
    unsigned: true,
    name: 'id_historial',
    comment: 'Identificador de la tabla historial'
  })
  id: number;

  @Index({
    unique: false,
  })
  @Column({
    type: 'varchar',
    nullable: true,
    name: 'estado',
    comment: 'Fecha del estado'
  })
  estado?: string;

  @Index({
    unique: false,
  })
  @Column({
    type: 'varchar',
    nullable: true,
    name: 'fechaCreacion',
    comment: 'Fecha creacion del historial'
  })
  fechaCreacion?: string;

  @OneToMany(
    // tslint:disable-next-line:no-shadowed-variable
    type => DetalleHistorialEntity, //Entidad
    detalle => detalle.historial, //Nombre del campo
  )
  detalles: DetalleHistorialEntity[];

  @OneToOne(type => PacienteEntity, paciente => paciente.historial)
  @JoinColumn()
  paciente: PacienteEntity;

}