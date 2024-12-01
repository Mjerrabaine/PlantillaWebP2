import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { ClaseService } from './clase.service';
import { ClaseEntity } from './clase.entity/clase.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('ClaseService', () => {
  let service: ClaseService;
  let claseRepository: Repository<ClaseEntity>;
  let testClase: ClaseEntity;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClaseService,
        {
          provide: getRepositoryToken(ClaseEntity),
          useValue: {
            findOne: jest.fn(async (condition: any) => {
              if (condition.where?.id === testClase.id) {
                return testClase;
              }
              return null;
            }),
            create: jest.fn((entity) => ({
              ...entity,
              id: faker.number.int(),
            })),
            save: jest.fn(async (entity) => entity),
            clear: jest.fn(async () => Promise.resolve()),
          },
        },
      ],
    }).compile();

    service = module.get<ClaseService>(ClaseService);
    claseRepository = module.get<Repository<ClaseEntity>>(getRepositoryToken(ClaseEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    await claseRepository.clear();

    testClase = {
      id: 1,
      nombre: 'Math Class',
      codigo: '1234567890',
      bonos: [],
      usuario: null,
    } as ClaseEntity;

    jest.spyOn(claseRepository, 'findOne').mockResolvedValue(testClase);
  };

  it('findClaseById should return a clase', async () => {
    const clase = await service.findClaseById(testClase.id);
    expect(clase).not.toBeNull();
    expect(clase.nombre).toBe(testClase.nombre);
    expect(clase.codigo).toBe(testClase.codigo);
  });

  it('findClaseById should throw an exception for an invalid id', async () => {
    jest.spyOn(claseRepository, 'findOne').mockResolvedValueOnce(null);

    await expect(service.findClaseById(999)).rejects.toHaveProperty(
      'message',
      'The clase with the given id was not found',
    );
  });

  it('crearClase should create a new clase', async () => {
    const newClase = {
      nombre: 'Physics Class',
      codigo: '0987654321',
    } as ClaseEntity;

    const result = await service.crearClase(newClase);
    expect(result).not.toBeNull();
    expect(result.nombre).toBe(newClase.nombre);
    expect(result.codigo).toBe(newClase.codigo);
  });

  it('crearClase should throw an exception for invalid codigo', async () => {
    const invalidClase = {
      nombre: 'Invalid Class',
      codigo: '1234', // Invalid length
    } as ClaseEntity;

    await expect(service.crearClase(invalidClase)).rejects.toHaveProperty(
      'message',
      'The code of the class needs to have 10 characters',
    );
  });
});
