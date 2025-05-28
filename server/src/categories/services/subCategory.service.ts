import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import {
  SubCategory,
  SubCategoryDocument,
} from '../schemas/subcategory.schema';
import { Category, CategoryDocument } from '../schemas/category.schema';

import {
  CreateSubCategoryDto,
  UpdateSubCategoryDto,
} from '../dto/subcategory.dto';
import { AGE_GROUPS, COLORS, SIZES } from '../categories.constants';

@Injectable()
export class SubCategoryService {
  constructor(
    @InjectModel(SubCategory.name)
    private subCategoryModel: Model<SubCategoryDocument>,
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
  ) {}

  async findAll(
    categoryId?: string,
    includeInactive = false,
  ): Promise<SubCategory[]> {
    const filter: any = includeInactive ? {} : { isActive: true };
    if (categoryId) {
      filter.category = categoryId;
    }

    return this.subCategoryModel
      .find(filter)
      .populate('category', 'name')
      .sort({ name: 1 })
      .exec();
  }

  async findById(id: string): Promise<SubCategory> {
    const subCategory = await this.subCategoryModel
      .findById(id)
      .populate('category', 'name')
      .exec();

    if (!subCategory) {
      throw new NotFoundException(`SubCategory with ID ${id} not found`);
    }

    return subCategory;
  }

  async findByName(name: string, categoryId: string): Promise<SubCategory> {
    const subCategory = await this.subCategoryModel
      .findOne({ name, category: categoryId })
      .populate('category', 'name')
      .exec();

    if (!subCategory) {
      throw new NotFoundException(
        `SubCategory with name ${name} in category ${categoryId} not found`,
      );
    }

    return subCategory;
  }

  async create(
    createSubCategoryDto: CreateSubCategoryDto,
  ): Promise<SubCategory> {
    // Check if the category exists
    const categoryId = createSubCategoryDto.categoryId;

    if (!isValidObjectId(categoryId)) {
      throw new BadRequestException(
        `Invalid category ID format: ${categoryId}`,
      );
    }

    const categoryExists = await this.categoryModel.exists({
      _id: categoryId,
    });

    if (!categoryExists) {
      throw new NotFoundException(`Category with ID ${categoryId} not found`);
    }

    // Normalize name to prevent duplicates with different cases or whitespace
    const normalizedName = createSubCategoryDto.name.trim();

    // Check if a subcategory with the same name exists in this category (case insensitive)
    const existingSubCategory = await this.subCategoryModel
      .findOne({
        name: { $regex: new RegExp(`^${normalizedName}$`, 'i') },
        category: categoryId,
      })
      .exec();

    if (existingSubCategory) {
      throw new BadRequestException(
        `Subcategory with name "${normalizedName}" already exists in this category`,
      );
    }

    const newSubCategory = new this.subCategoryModel({
      ...createSubCategoryDto,
      name: normalizedName,
      category: categoryId,
      // Initialize with empty arrays if not provided
      ageGroups: createSubCategoryDto.ageGroups || [],
      sizes: createSubCategoryDto.sizes || [],
      colors: createSubCategoryDto.colors || [],
    });

    await newSubCategory.save();

    return this.subCategoryModel
      .findById(newSubCategory._id)
      .populate('category', 'name')
      .exec();
  }

  async update(
    id: string,
    updateSubCategoryDto: UpdateSubCategoryDto,
  ): Promise<SubCategory> {
    // If category is being changed, verify it exists
    if (updateSubCategoryDto.categoryId) {
      const categoryExists = await this.categoryModel.exists({
        _id: updateSubCategoryDto.categoryId,
      });
      if (!categoryExists) {
        throw new NotFoundException(
          `Category with ID ${updateSubCategoryDto.categoryId} not found`,
        );
      }
    }

    // If updating name, check if it already exists in the category
    if (updateSubCategoryDto.name && updateSubCategoryDto.categoryId) {
      const existingSubCategory = await this.subCategoryModel
        .findOne({
          name: updateSubCategoryDto.name,
          category: updateSubCategoryDto.categoryId,
          _id: { $ne: id },
        })
        .exec();

      if (existingSubCategory) {
        throw new BadRequestException(
          `Subcategory with name ${updateSubCategoryDto.name} already exists in this category`,
        );
      }
    }

    const updateData: any = { ...updateSubCategoryDto };
    if (updateSubCategoryDto.categoryId) {
      updateData.category = updateSubCategoryDto.categoryId;
      delete updateData.categoryId;
    }

    const updatedSubCategory = await this.subCategoryModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .populate('category', 'name')
      .exec();

    if (!updatedSubCategory) {
      throw new NotFoundException(`SubCategory with ID ${id} not found`);
    }

    return updatedSubCategory;
  }

  async remove(id: string): Promise<void> {
    const result = await this.subCategoryModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`SubCategory with ID ${id} not found`);
    }
  }

  getAttributeOptions(): any {
    return {
      ageGroups: AGE_GROUPS,
      sizes: SIZES,
      colors: COLORS,
    };
  }

  // Add methods for managing subcategory attributes (size, color)

  // Add a size to subcategory
  async addSize(id: string, size: string): Promise<SubCategory> {
    const subCategory = await this.findById(id);

    if (subCategory.sizes.includes(size)) {
      throw new BadRequestException(
        `Size ${size} already exists in this subcategory`,
      );
    }

    subCategory.sizes.push(size);
    return this.subCategoryModel
      .findByIdAndUpdate(id, { sizes: subCategory.sizes }, { new: true })
      .populate('category', 'name');
  }

  // Remove a size from subcategory
  async removeSize(id: string, size: string): Promise<SubCategory> {
    const subCategory = await this.findById(id);

    if (!subCategory.sizes.includes(size)) {
      throw new BadRequestException(
        `Size ${size} does not exist in this subcategory`,
      );
    }

    const updatedSizes = subCategory.sizes.filter((s) => s !== size);
    return this.subCategoryModel
      .findByIdAndUpdate(id, { sizes: updatedSizes }, { new: true })
      .populate('category', 'name');
  }

  // Set all sizes for subcategory
  async setSizes(id: string, sizes: string[]): Promise<SubCategory> {
    await this.findById(id); // Verify subcategory exists

    return this.subCategoryModel
      .findByIdAndUpdate(id, { sizes }, { new: true })
      .populate('category', 'name');
  }

  // Add a color to subcategory
  async addColor(id: string, color: string): Promise<SubCategory> {
    const subCategory = await this.findById(id);

    if (subCategory.colors.includes(color)) {
      throw new BadRequestException(
        `Color ${color} already exists in this subcategory`,
      );
    }

    subCategory.colors.push(color);
    return this.subCategoryModel
      .findByIdAndUpdate(id, { colors: subCategory.colors }, { new: true })
      .populate('category', 'name');
  }

  // Remove a color from subcategory
  async removeColor(id: string, color: string): Promise<SubCategory> {
    const subCategory = await this.findById(id);

    if (!subCategory.colors.includes(color)) {
      throw new BadRequestException(
        `Color ${color} does not exist in this subcategory`,
      );
    }

    const updatedColors = subCategory.colors.filter((c) => c !== color);
    return this.subCategoryModel
      .findByIdAndUpdate(id, { colors: updatedColors }, { new: true })
      .populate('category', 'name');
  }

  // Set all colors for subcategory
  async setColors(id: string, colors: string[]): Promise<SubCategory> {
    await this.findById(id); // Verify subcategory exists

    return this.subCategoryModel
      .findByIdAndUpdate(id, { colors }, { new: true })
      .populate('category', 'name');
  }

  // Add an age group to subcategory
  async addAgeGroup(id: string, ageGroup: string): Promise<SubCategory> {
    const subCategory = await this.findById(id);

    if (subCategory.ageGroups.includes(ageGroup)) {
      throw new BadRequestException(
        `Age group ${ageGroup} already exists in this subcategory`,
      );
    }

    subCategory.ageGroups.push(ageGroup);
    return this.subCategoryModel
      .findByIdAndUpdate(
        id,
        { ageGroups: subCategory.ageGroups },
        { new: true },
      )
      .populate('category', 'name');
  }

  // Remove an age group from subcategory
  async removeAgeGroup(id: string, ageGroup: string): Promise<SubCategory> {
    const subCategory = await this.findById(id);

    if (!subCategory.ageGroups.includes(ageGroup)) {
      throw new BadRequestException(
        `Age group ${ageGroup} does not exist in this subcategory`,
      );
    }

    const updatedAgeGroups = subCategory.ageGroups.filter(
      (ag) => ag !== ageGroup,
    );
    return this.subCategoryModel
      .findByIdAndUpdate(id, { ageGroups: updatedAgeGroups }, { new: true })
      .populate('category', 'name');
  }

  // Set all age groups for subcategory
  async setAgeGroups(id: string, ageGroups: string[]): Promise<SubCategory> {
    await this.findById(id); // Verify subcategory exists

    return this.subCategoryModel
      .findByIdAndUpdate(id, { ageGroups }, { new: true })
      .populate('category', 'name');
  }

  /**
   * Get all unique colors from subcategories
   */
  async getAllColors(): Promise<string[]> {
    const subcategories = await this.subCategoryModel
      .find({
        colors: { $exists: true, $ne: [] },
      })
      .exec();

    const colors = new Set<string>();

    subcategories.forEach((subcategory) => {
      subcategory.colors.forEach((color) => {
        colors.add(color);
      });
    });

    return Array.from(colors).sort();
  }

  /**
   * Get all unique sizes from subcategories
   */
  async getAllSizes(): Promise<string[]> {
    const subcategories = await this.subCategoryModel
      .find({
        sizes: { $exists: true, $ne: [] },
      })
      .exec();

    const sizes = new Set<string>();

    subcategories.forEach((subcategory) => {
      subcategory.sizes.forEach((size) => {
        sizes.add(size);
      });
    });

    return Array.from(sizes).sort();
  }

  /**
   * Get all unique age groups from subcategories
   */
  async getAllAgeGroups(): Promise<string[]> {
    const subcategories = await this.subCategoryModel
      .find({
        ageGroups: { $exists: true, $ne: [] },
      })
      .exec();

    const ageGroups = new Set<string>();

    subcategories.forEach((subcategory) => {
      subcategory.ageGroups.forEach((ageGroup) => {
        ageGroups.add(ageGroup);
      });
    });

    return Array.from(ageGroups).sort();
  }

  /**
   * Create a new color
   */
  async createColor(color: string): Promise<string> {
    if (!color || color.trim() === '') {
      throw new BadRequestException('Color name cannot be empty');
    }

    const colors = await this.getAllColors();
    if (colors.includes(color)) {
      throw new BadRequestException(`Color "${color}" already exists`);
    }

    // Create a "global" color reference that can be used by all subcategories
    // This is a simplified approach - in a real app, you might have a separate collection for colors
    return color;
  }

  /**
   * Update a color name
   */
  async updateColor(oldColor: string, newColor: string): Promise<string> {
    if (!newColor || newColor.trim() === '') {
      throw new BadRequestException('New color name cannot be empty');
    }

    const colors = await this.getAllColors();
    if (!colors.includes(oldColor)) {
      throw new NotFoundException(`Color "${oldColor}" not found`);
    }

    if (colors.includes(newColor) && oldColor !== newColor) {
      throw new BadRequestException(`Color "${newColor}" already exists`);
    }

    // Update all subcategories that use this color
    const subcategories = await this.subCategoryModel
      .find({
        colors: oldColor,
      })
      .exec();

    for (const subcategory of subcategories) {
      const colorIndex = subcategory.colors.indexOf(oldColor);
      if (colorIndex !== -1) {
        subcategory.colors[colorIndex] = newColor;
        await subcategory.save();
      }
    }

    return newColor;
  }

  /**
   * Delete a color
   */
  async deleteColor(color: string): Promise<void> {
    const colors = await this.getAllColors();
    if (!colors.includes(color)) {
      throw new NotFoundException(`Color "${color}" not found`);
    }

    // Remove this color from all subcategories
    await this.subCategoryModel
      .updateMany({ colors: color }, { $pull: { colors: color } })
      .exec();
  }

  /**
   * Create a new size
   */
  async createSize(size: string): Promise<string> {
    if (!size || size.trim() === '') {
      throw new BadRequestException('Size name cannot be empty');
    }

    const sizes = await this.getAllSizes();
    if (sizes.includes(size)) {
      throw new BadRequestException(`Size "${size}" already exists`);
    }

    // Create a "global" size reference
    return size;
  }

  /**
   * Update a size name
   */
  async updateSize(oldSize: string, newSize: string): Promise<string> {
    if (!newSize || newSize.trim() === '') {
      throw new BadRequestException('New size name cannot be empty');
    }

    const sizes = await this.getAllSizes();
    if (!sizes.includes(oldSize)) {
      throw new NotFoundException(`Size "${oldSize}" not found`);
    }

    if (sizes.includes(newSize) && oldSize !== newSize) {
      throw new BadRequestException(`Size "${newSize}" already exists`);
    }

    // Update all subcategories that use this size
    const subcategories = await this.subCategoryModel
      .find({
        sizes: oldSize,
      })
      .exec();

    for (const subcategory of subcategories) {
      const sizeIndex = subcategory.sizes.indexOf(oldSize);
      if (sizeIndex !== -1) {
        subcategory.sizes[sizeIndex] = newSize;
        await subcategory.save();
      }
    }

    return newSize;
  }

  /**
   * Delete a size
   */
  async deleteSize(size: string): Promise<void> {
    const sizes = await this.getAllSizes();
    if (!sizes.includes(size)) {
      throw new NotFoundException(`Size "${size}" not found`);
    }

    // Remove this size from all subcategories
    await this.subCategoryModel
      .updateMany({ sizes: size }, { $pull: { sizes: size } })
      .exec();
  }

  /**
   * Create a new age group
   */
  async createAgeGroup(ageGroup: string): Promise<string> {
    if (!ageGroup || ageGroup.trim() === '') {
      throw new BadRequestException('Age group name cannot be empty');
    }

    const ageGroups = await this.getAllAgeGroups();
    if (ageGroups.includes(ageGroup)) {
      throw new BadRequestException(`Age group "${ageGroup}" already exists`);
    }

    // Create a "global" age group reference
    return ageGroup;
  }

  /**
   * Update an age group name
   */
  async updateAgeGroup(
    oldAgeGroup: string,
    newAgeGroup: string,
  ): Promise<string> {
    if (!newAgeGroup || newAgeGroup.trim() === '') {
      throw new BadRequestException('New age group name cannot be empty');
    }

    const ageGroups = await this.getAllAgeGroups();
    if (!ageGroups.includes(oldAgeGroup)) {
      throw new NotFoundException(`Age group "${oldAgeGroup}" not found`);
    }

    if (ageGroups.includes(newAgeGroup) && oldAgeGroup !== newAgeGroup) {
      throw new BadRequestException(
        `Age group "${newAgeGroup}" already exists`,
      );
    }

    // Update all subcategories that use this age group
    const subcategories = await this.subCategoryModel
      .find({
        ageGroups: oldAgeGroup,
      })
      .exec();

    for (const subcategory of subcategories) {
      const ageGroupIndex = subcategory.ageGroups.indexOf(oldAgeGroup);
      if (ageGroupIndex !== -1) {
        subcategory.ageGroups[ageGroupIndex] = newAgeGroup;
        await subcategory.save();
      }
    }

    return newAgeGroup;
  }

  /**
   * Delete an age group
   */
  async deleteAgeGroup(ageGroup: string): Promise<void> {
    const ageGroups = await this.getAllAgeGroups();
    if (!ageGroups.includes(ageGroup)) {
      throw new NotFoundException(`Age group "${ageGroup}" not found`);
    }

    // Remove this age group from all subcategories
    await this.subCategoryModel
      .updateMany({ ageGroups: ageGroup }, { $pull: { ageGroups: ageGroup } })
      .exec();
  }
}
