import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesController } from './categories.controller';
import { CategoryService } from '../services/category.service';
import { SubCategoryService } from '../services/subcategory.service';
import { CreateCategoryDto } from '../dto/category.dto';
import { CreateSubCategoryDto } from '../dto/subcategory.dto';

describe('CategoriesController', () => {
  let controller: CategoriesController;
  let categoryService: CategoryService;
  let subCategoryService: SubCategoryService;

  const mockCategoryService = {
    findAll: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    getDefaultAttributes: jest.fn(),
  };

  const mockSubCategoryService = {
    findAll: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    getAttributeOptions: jest.fn(),
    getAllColors: jest.fn(),
    getAllSizes: jest.fn(),
    getAllAgeGroups: jest.fn(),
    createColor: jest.fn(),
    updateColor: jest.fn(),
    deleteColor: jest.fn(),
    createSize: jest.fn(),
    updateSize: jest.fn(),
    deleteSize: jest.fn(),
    createAgeGroup: jest.fn(),
    updateAgeGroup: jest.fn(),
    deleteAgeGroup: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [
        {
          provide: CategoryService,
          useValue: mockCategoryService,
        },
        {
          provide: SubCategoryService,
          useValue: mockSubCategoryService,
        },
      ],
    }).compile();

    controller = module.get<CategoriesController>(CategoriesController);
    categoryService = module.get<CategoryService>(CategoryService);
    subCategoryService = module.get<SubCategoryService>(SubCategoryService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAllCategories', () => {
    it('should return an array of categories', async () => {
      const result = [{ name: 'ტანსაცმელი', isActive: true }];
      mockCategoryService.findAll.mockResolvedValue(result);

      expect(await controller.findAllCategories('false')).toBe(result);
      expect(mockCategoryService.findAll).toHaveBeenCalledWith(false);
    });
  });

  // Add more tests as needed
});
