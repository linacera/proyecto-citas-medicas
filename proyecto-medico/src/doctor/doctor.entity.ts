import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CitaEntity } from '../cita/cita.entity';

@Entity('doctor_proyecto')
export class DoctorEntity {

  @PrimaryGeneratedColumn({
    type: 'int',
    unsigned: true,
    name: 'id_doctor',
    comment: 'Identificador de la tabla doctor'
  })
  id: number;

  @Index({
    unique: false,
  })
  @Column({
    type: 'varchar',
    nullable: true,
    name: 'nombre',
    comment: 'Nombre del doctor'
  })
  nombre?: string;

  @Index({
    unique: false,
  })
  @Column({
    type: 'varchar',
    nullable: true,
    name: 'apellido',
    comment: 'Apellido del doctor'
  })
  apellido?: string;

  @Index({
    unique: false,
  })
  @Column({
    type: 'varchar',
    nullable: true,
    name: 'especialidad',
    comment: 'especialidad del doctor'
  })
  especialidad?: string;

  @Index({
    unique: false,
  })
  @Column({
    type: 'varchar',
    nullable: true,
    name: 'telefono',
    comment: 'telefono del doctor'
  })
  telefono?: string;

  @Index({
    unique: false,
  })
  @Column({
    type: 'varchar',
    nullable: true,
    name: 'direccion',
    comment: 'direccion del doctor'
  })
  direccion?: string;

  @OneToMany(
    // tslint:disable-next-line:no-shadowed-variable
    type => CitaEntity, //Entidad
    cita => cita.doctor, //Nombre del campo
  )
  citas: CitaEntity[];


}
