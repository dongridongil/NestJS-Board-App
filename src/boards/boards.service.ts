import { Injectable, NotFoundException } from '@nestjs/common';
import { BoardStatus } from './board.status.enum';
import { CreateBoardDto } from './dto/create-board.dto';
import { BoardRepository } from './board.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Board } from './board.entity';
import { User } from 'src/auth/user.entity';


@Injectable()
export class BoardsService {
    constructor(
        @InjectRepository(BoardRepository)
        private boardRepository: BoardRepository
    ) { }
    // getAllBoards(): Board[] {
    //     return this.boards;
    // }


    async getAllBoards(): Promise <Board[]>{
        return this.boardRepository.find();
    }
    // createBoard(createBoardDto: CreateBoardDto) {
    //     const title = createBoardDto.title;
    //     const description = createBoardDto.description;
    //     const board: Board = {
    //         id: uuid(),
    //         title,
    //         description,
    //         status: BoardStatus.PUBLIC
    //     }
    //     this.boards.push(board);
    //     return board;
    // }
    createBoard(createBoardDto: CreateBoardDto, user:User): Promise<Board> {

        return this.boardRepository.createBoard(createBoardDto,user);
    }


    async getBoardById(id: number): Promise<Board> {
        const found = await this.boardRepository.findOne(id);

        if (!found) {
            throw new NotFoundException(`${id} 를 찾을수 없습니다!`);

        }
        return found;
    }
    // getBoardById(id: string): Board {
    //     const found = this.boards.find((board) => board.id === id);
    //     if (!found) {
    //         throw new NotFoundException(`${id} 에 맞는 게시글을 찾을수없습니다`);
    //     }
    //     return found;
    // }

    async deleteBoard(id: number): Promise<void> {
        const result = await this.boardRepository.delete(id);

        if (result.affected === 0) {
            throw new NotFoundException(`Can't find Board with id${id}`)
        }
        console.log('result', result)
    }




    //board 수정
    async updateBoardStatus(id: number, status: BoardStatus): Promise<Board> {
        const board = await this.getBoardById(id);

        board.status = status;
        await this.boardRepository.save(board);

        return board;
    }
}
