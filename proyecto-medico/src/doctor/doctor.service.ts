import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, getRepository, MoreThan, Repository } from 'typeorm';
import { DoctorEntity } from './doctor.entity';


@Injectable()
export class DoctorService{
  constructor(
    @InjectRepository(DoctorEntity) private _repositorioDoctor: Repository<DoctorEntity>
  ) {

  }

  encontrarUno(id: number): Promise<DoctorEntity | undefined> {
    return this._repositorioDoctor
      .findOne(id);
  }

  crearUno(doctor: DoctorEntity) {
    return this._repositorioDoctor
      .save(doctor);
  }

  borrarUno(id: number): Promise<DeleteResult> {
    return this._repositorioDoctor
      .delete(id);
  }

  actualizarUno(
    id: number,
    doctor: DoctorEntity
  ): Promise<DoctorEntity> {
    doctor.id = id;
    return this._repositorioDoctor
      .save(doctor); // UPSERT
  }

  buscar(
    where: any = {},
    skip: number = 0,
    take: number = 10,
    order: any = {
      id: 'ASC',
    }): Promise<DoctorEntity[]> {

    // Exactamente el name o LIKE la idCard

    return this._repositorioDoctor
      .find({
        where: where,
        skip: skip,
        take: take,
        order: order,
      });
  }

  async encontrarCitasDeDoctor(idDoctor: number) : Promise<DoctorEntity>{
    return  await this._repositorioDoctor.findOne(
      {
        where: { id: idDoctor }, relations: ['citas']
      })
  }

  async encontarDoctorPorUserId(idUsuario: number): Promise<DoctorEntity>{
    return await getRepository(DoctorEntity).
    createQueryBuilder('doctor')
      .where("doctor.usuarioId = :idUsuario", {idUsuario: idUsuario})
      .getOne()
  }


}
