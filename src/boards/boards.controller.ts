import { Body, Controller, Get ,Param,Post,Delete,Patch, UsePipes, ValidationPipe, ParseIntPipe, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user-decorator';
import { User } from 'src/auth/user.entity';
import { Board } from './board.entity';
import {BoardStatus } from './board.status.enum';
import { BoardsService } from './boards.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { BoardStatusValidationPipe } from './pipes/board-status-validation.pipe';

@Controller('boards')
@UseGuards(AuthGuard())
export class BoardsController {
    constructor(private boardService: BoardsService) {
    }

    //모든 게시글을 조회하기
    @Get()
    getAllBoard(): Promise<Board[]>{
        return this.boardService.getAllBoards();
    }

    //게시글 생성하기
    @Post()
    @UsePipes(ValidationPipe)
    createBoard(@Body() CreateBoardDto :CreateBoardDto
    ,@GetUser() user:User):Promise<Board>{
        return this.boardService.createBoard(CreateBoardDto ,user)
    }

    //아이디로 게시글 검색하기
    @Get('/:id')
    getBoardById(@Param('id') id:number) : Promise<Board>{
        return this.boardService.getBoardById(id);
    }
   

    //게시글삭제하기
    @Delete('/:id')
    deleteBoard(@Param('id', ParseIntPipe) id):Promise<void>{
        return this.boardService.deleteBoard(id);
    }
   
    //게시글 수정하기
    @Patch('/:id/status')
    updateBoardStatus(
        @Param('id', ParseIntPipe) id:number,
        @Body('status', BoardStatusValidationPipe) status:BoardStatus,
    ): Promise<Board>{
        return this.boardService.updateBoardStatus(id,status);
    }
    
}

