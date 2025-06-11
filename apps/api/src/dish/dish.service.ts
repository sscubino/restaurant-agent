import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Platillo } from './entities/dish.entities';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class DishService {
  constructor(
    @InjectRepository(Platillo) private dishRepo: Repository<Platillo>,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}

  async create(userId: number, name: string, desc: string, price: number) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const dish = this.dishRepo.create({
      name,
      desc,
      price,
      user,
      availability: true,
    });
    return this.dishRepo.save(dish);
  }

  async findAllByUser(userId: number) {
    return this.dishRepo.find({ where: { user: { id: userId } } });
  }

  async update(
    userId: number,
    dishId: number,
    available: boolean,
    name?: string,
    desc?: string,
    price?: string,
  ) {
    const dish = await this.dishRepo.findOne({
      where: { id: dishId },
      relations: ['user'],
    });
    if (!dish) throw new NotFoundException('Dish not found');
    if (dish.user.id !== userId) throw new ForbiddenException('Access denied');

    Object.assign(dish, { name, desc, price, availability: available });
    return this.dishRepo.save(dish);
  }

  async delete(userId: number, dishId: number) {
    const dish = await this.dishRepo.findOne({
      where: { id: dishId },
      relations: ['user'],
    });
    if (!dish) throw new NotFoundException('Platillo no encontrado');
    if (dish.user.id !== userId) throw new ForbiddenException('Access denied');

    await this.dishRepo.delete(dishId);
    return { message: 'Platillo eliminado' };
  }

  async getFormatedText(userId: number) {
    try {
      const allDishes = await this.dishRepo.find({
        where: { user: { id: userId } },
      });
      let formatedText = 'Dishes:\n';

      allDishes.map((dish, index) => {
        const text = `
        \n
        name:${dish.name}
        price:${dish.price}
        description:${dish.desc}
        id: ${dish.id}
        \n
        `;
        formatedText += text;
      });

      return formatedText;
    } catch (error) {
      console.log('error');
    }
  }
}
