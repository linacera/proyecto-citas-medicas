import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, MoreThan, Repository } from 'typeorm';
import { CitaEntity } from './cita.entity';
import { DoctorEntity } from '../doctor/doctor.entity';

@Injectable()
export class CitaService{
  constructor(
    @InjectRepository(CitaEntity) private _repositorioCita: Repository<CitaEntity>
  ) {

  }

  encontrarUno(id: number): Promise<CitaEntity | undefined> {
    return this._repositorioCita
      .findOne(id);
  }

  crearUno(doctor: CitaEntity) {
    return this._repositorioCita
      .save(doctor);
  }

  borrarUno(id: number): Promise<DeleteResult> {
    return this._repositorioCita
      .delete(id);
  }

  actualizarUno(
    id: number,
    doctor: CitaEntity
  ): Promise<CitaEntity> {
    doctor.id = id;
    return this._repositorioCita
      .save(doctor); // UPSERT
  }

  buscar(
    where: any = {},
    skip: number = 0,
    take: number = 10,
    order: any = {
      id: 'ASC',
    }): Promise<CitaEntity[]> {

    return this._repositorioCita
      .find({
        where: where,
        skip: skip,
        take: take,
        order: order,
      });
  }

  async buscarCitasConRelaciones():Promise<CitaEntity[]>{
    const allCitas = await this._repositorioCita.find();
    const allCitasConRelaciones: CitaEntity[] = [new CitaEntity()];
    let citaConRelaciones: CitaEntity = new CitaEntity();
    for (const cita of allCitas) {
      citaConRelaciones = await this._repositorioCita.findOne({
        where: { id: cita.id}, relations : ['doctor','paciente']});
      allCitasConRelaciones.push(citaConRelaciones);
    }
    allCitasConRelaciones.shift();
    return allCitasConRelaciones;
  }

  async buscarRelacionesDeCitas(citas:CitaEntity[]):Promise<CitaEntity[]>{
    let citaAux = new CitaEntity();
    const citasConRelaciones = [new CitaEntity()];
    for (const cita of citas) {
      citaAux = await this._repositorioCita.findOne({
        where: { id: cita.id}, relations : ['doctor','paciente']});
      citasConRelaciones.push(citaAux);
    }
    citasConRelaciones.shift();
    return citasConRelaciones;
  }

}