import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entities';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto, EditUserDto } from './dtos';

export interface UserFindOne{

  email: string;
  //id: number;
}

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async getMany() {
    return await this.userRepository.find()
  }
  
  async getOne(id: number, UserEntity?: User) {
    const user = await this.userRepository.findOne(id)
    .then(u => !UserEntity ? u : !!u && UserEntity.id === u.id ? u : null)
    if (!user) throw new NotFoundException('Usuario no existe o no esta authenticado')

    return user;
  }
  
  async createOne(dto: CreateUserDto) {
    const userExist = await this.userRepository.findOne({ email: dto.email });
    if (userExist) throw new BadRequestException('User already registered with email');

    const newUser = this.userRepository.create(dto)
    const user = await this.userRepository.save(newUser)

    delete user.password;
    return user;
  }
  
  async editOne(id: number, dto: EditUserDto, UserEntity?: User) {
    const user = await this.getOne(id, UserEntity)   
    const editedUser = Object.assign(user, dto);
    return await this.userRepository.save(editedUser);
  }
  
  async deleteOne(id: number, UserEntity?: User) {
    const user = await this.getOne(id, UserEntity);
    return await this.userRepository.remove(user);
  }

  async findOne(data: UserFindOne){
    return await this.userRepository
    .createQueryBuilder('user')
    .where({data})
    .addSelect('user.password')
    .getOne()
  }
}
