import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { UsuarioService } from './usuario.service';
import { UsuarioEntity } from './usuario.entity/usuario.entity';
import { ClaseEntity } from '../clase/clase.entity/clase.entity';
import { BonoEntity } from '../bono/bono.entity/bono.entity';
import { TypeOrmTestingConfig } from './../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';
import { Rol } from './usuario.dto/usuario.dto';

describe('UsuarioService', () => {
  let service: UsuarioService;
  let usuarioRepository: Repository<UsuarioEntity>;
  let testUsuario: UsuarioEntity;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsuarioService,
        {
          provide: getRepositoryToken(UsuarioEntity),
          useValue: {
            findOne: jest.fn(async (condition: any) => {
              if (condition.where?.id === testUsuario.id) {
                return testUsuario;
              }
              return null;
            }),
            create: jest.fn((entity) => ({
              ...entity,
              id: faker.number.int(),
            })),
            save: jest.fn(async (entity) => entity),
            delete: jest.fn(async ({ id }) => {
              if (id === testUsuario.id) {
                return { affected: 1 };
              }
              return { affected: 0 };
            }),
            clear: jest.fn(async () => Promise.resolve()), // Add the mock for clear
            remove: jest.fn(async (entity) => {
              if (entity.id === testUsuario.id) {
                return entity; // Simulate successful removal
              }
              throw new Error('Entity not found'); // Simulate failure
            }),
          },
        },
      ],
    }).compile();
  
    service = module.get<UsuarioService>(UsuarioService);
    usuarioRepository = module.get<Repository<UsuarioEntity>>(getRepositoryToken(UsuarioEntity));
    await seedDatabase();
  });

 
const seedDatabase = async () => {
  await usuarioRepository.clear();

  testUsuario = {
    id: 1,
    nombre: 'John Doe',
    rol: Rol.PROFESOR,
    grupoInvestigacion: 'TICSW',
    cedula: 12345678,
    numeroExtension: 87654321,
    bonos: [], // Initialize bonos
    clases: [], // Initialize clases
  } as UsuarioEntity;

  jest.spyOn(usuarioRepository, 'findOne').mockResolvedValue(testUsuario);
  };

  it('findUsuarioById should return a usuario', async () => {
    const usuario = await service.findUsuarioById(testUsuario.id);
    expect(usuario).not.toBeNull();
    expect(usuario.nombre).toBe(testUsuario.nombre);
    expect(usuario.rol).toBe(testUsuario.rol);
  });

  it('findUsuarioById should throw an exception for an invalid id', async () => {
    jest.spyOn(usuarioRepository, 'findOne').mockResolvedValueOnce(null);
  
    await expect(service.findUsuarioById(999)).rejects.toHaveProperty(
      'message',
      'The usuario with the given id was not found',
    );
  });

  it('crearUsuario should create a new usuario', async () => {
    const newUsuario = {
      nombre: 'Jane Smith',
      rol: 'Profesor',
      grupoInvestigacion: 'COMIT',
      cedula: 23456789,
      numeroExtension: 12345678,
    };

    const result = await service.crearUsuario(newUsuario as UsuarioEntity);
    expect(result).not.toBeNull();
    expect(result.nombre).toBe(newUsuario.nombre);
  });

  it('crearUsuario should throw an exception for invalid grupoInvestigacion', async () => {
    const invalidUsuario = {
      nombre: 'Jane Smith',
      rol: 'Profesor',
      grupoInvestigacion: 'INVALID_GROUP',
      cedula: 23456789,
      numeroExtension: 12345678,
    };

    await expect(service.crearUsuario(invalidUsuario as UsuarioEntity)).rejects.toHaveProperty(
      'message',
      'The user with the role Profesor must belong to a valid grupo de investigacion (TICSW, IMAGINE, COMIT)',
    );
  });

  it('eliminarUsuario should delete a usuario', async () => {
    jest.spyOn(usuarioRepository, 'findOne').mockResolvedValueOnce({
      ...testUsuario,
      bonos: [], // No bonos associated
      clases: [], // No clases associated
    });

    await service.eliminarUsuario(testUsuario.id);

    expect(usuarioRepository.remove).toHaveBeenCalledWith(testUsuario);
  });
  
    it('eliminarUsuario should throw an exception for usuario with associated bonos', async () => {
      jest.spyOn(usuarioRepository, 'findOne').mockResolvedValueOnce({
        ...testUsuario,
        bonos: [
          {
            id: 1,
            palabraClave: 'Research',
            calificacion: 5,
            monto: 1000,
            usuario: testUsuario,
            clase: null,
          },
        ],
      });
    
      await expect(service.eliminarUsuario(testUsuario.id)).rejects.toHaveProperty(
        'message',
        'The usuario with the given id has bonos or has user rol Decana and can not be deleted',
      );
    });
});
