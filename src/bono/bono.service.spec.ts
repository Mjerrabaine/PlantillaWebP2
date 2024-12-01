import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { BonoService } from './bono.service';
import { BonoEntity } from './bono.entity/bono.entity';
import { UsuarioEntity } from '../usuario/usuario.entity/usuario.entity';
import { ClaseEntity } from '../clase/clase.entity/clase.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('BonoService', () => {
  let service: BonoService;
  let bonoRepository: Repository<BonoEntity>;
  let usuarioRepository: Repository<UsuarioEntity>;
  let claseRepository: Repository<ClaseEntity>;
  let testBono: BonoEntity;
  let testUsuario: UsuarioEntity;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BonoService,
        {
          provide: getRepositoryToken(BonoEntity),
          useValue: {
            findOne: jest.fn(),
            find: jest.fn(),
            create: jest.fn((entity) => ({ ...entity, id: faker.number.int() })),
            save: jest.fn(async (entity) => entity),
            remove: jest.fn(async (entity) => entity),
            clear: jest.fn(async () => Promise.resolve()),
          },
        },
        {
          provide: getRepositoryToken(UsuarioEntity),
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(ClaseEntity),
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<BonoService>(BonoService);
    bonoRepository = module.get<Repository<BonoEntity>>(getRepositoryToken(BonoEntity));
    usuarioRepository = module.get<Repository<UsuarioEntity>>(getRepositoryToken(UsuarioEntity));
    claseRepository = module.get<Repository<ClaseEntity>>(getRepositoryToken(ClaseEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    await bonoRepository.clear();

    testUsuario = {
      id: 1,
      nombre: 'John Doe',
      rol: 'Profesor',
      grupoInvestigacion: 'TICSW',
      cedula: 12345678,
      numeroExtension: 87654321,
      bonos: [],
      clases: [],
    } as UsuarioEntity;

    testBono = {
      id: 1,
      palabraClave: 'Research',
      calificacion: 4,
      monto: 1000,
      usuario: testUsuario,
      clase: null,
    } as BonoEntity;

    jest.spyOn(usuarioRepository, 'findOne').mockResolvedValue(testUsuario);
    jest.spyOn(bonoRepository, 'findOne').mockResolvedValue(testBono);
  };

  it('findAllBonosByUsuario should return all bonos for a valid user', async () => {
    jest.spyOn(usuarioRepository, 'findOne').mockResolvedValueOnce({
      ...testUsuario,
      bonos: [testBono],
    });

    const bonos = await service.findAllBonosByUsuario(testUsuario.id);
    expect(bonos).toHaveLength(1);
    expect(bonos[0]).toEqual(testBono);
  });

  it('findAllBonosByUsuario should throw an exception if user is not found', async () => {
    jest.spyOn(usuarioRepository, 'findOne').mockResolvedValueOnce(null);

    await expect(service.findAllBonosByUsuario(999)).rejects.toHaveProperty(
      'message',
      'The usuario with the given id de clase was not found',
    );
  });

  it('findBonoByCodigo should return a bono for a valid class code', async () => {
    const bono = await service.findBonoByCodigo('validCode');
    expect(bono).toEqual(testBono);
  });

  it('findBonoByCodigo should throw an exception for an invalid class code', async () => {
    jest.spyOn(bonoRepository, 'findOne').mockResolvedValueOnce(null);

    await expect(service.findBonoByCodigo('invalidCode')).rejects.toHaveProperty(
      'message',
      'The bono with the given codigo de clase was not found',
    );
  });

  it('crearBono should create a new bono', async () => {
    const newBono = {
      palabraClave: 'Innovation',
      calificacion: 5,
      monto: 2000,
      usuario: testUsuario,
    } as BonoEntity;

    const result = await service.crearBono(newBono);
    expect(result).toBeTruthy();
    expect(result.palabraClave).toBe(newBono.palabraClave);
  });

  it('crearBono should throw an exception for invalid monto', async () => {
    const invalidBono = {
      monto: -1,
      usuario: testUsuario,
    } as BonoEntity;

    await expect(service.crearBono(invalidBono)).rejects.toHaveProperty(
      'message',
      'The bono must have a positive monto that is not empty',
    );
  });

  it('deleteBono should delete a bono with grade 4 or below', async () => {
    jest.spyOn(bonoRepository, 'findOne').mockResolvedValueOnce({
      ...testBono,
      calificacion: 4,
    });

    await service.deleteBono(testBono.id);

    expect(bonoRepository.remove).toHaveBeenCalledWith(testBono);
  });

  it('deleteBono should throw an exception for bono with grade above 4', async () => {
    jest.spyOn(bonoRepository, 'findOne').mockResolvedValueOnce({
      ...testBono,
      calificacion: 5,
    });

    await expect(service.deleteBono(testBono.id)).rejects.toHaveProperty(
      'message',
      'The bono can not be deleted it has a grade above 4',
    );
  });
});
