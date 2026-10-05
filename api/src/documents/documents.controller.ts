import {
  BadRequestException,
  Controller,
  Post,
  Param,
  Request,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { uploadsDirectory } from './upload-storage';
import {
  ApiBearerAuth,
  ApiTags,
  ApiCreatedResponse,
  ApiConsumes,
} from '@nestjs/swagger';
import { ActiveUserGuard } from '../auth/roles.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { DocumentsService } from './documents.service';

type AuthenticatedRequest = { user: { id: string } };

@ApiTags('documents')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, ActiveUserGuard)
@Controller('applications/:applicationId/documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiCreatedResponse({ description: 'Document ajouté au dossier.' })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: uploadsDirectory,
        filename: (req, file, cb) => {
          const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          cb(null, `${unique}${extname(file.originalname)}`);
        },
      }),
      limits: { fileSize: 10 * 1024 * 1024, files: 1 },
      fileFilter: (_request, file, callback) => {
        const extension = extname(file.originalname).toLowerCase();
        const allowed: Record<string, string[]> = {
          '.pdf': ['application/pdf'],
          '.jpg': ['image/jpeg'],
          '.jpeg': ['image/jpeg'],
          '.png': ['image/png'],
          '.doc': ['application/msword'],
          '.docx': [
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          ],
        };
        if (!allowed[extension]?.includes(file.mimetype)) {
          callback(
            new BadRequestException(
              'Formats autorisés : PDF, JPG, PNG, DOC et DOCX.',
            ),
            false,
          );
          return;
        }
        callback(null, true);
      },
    }),
  )
  upload(
    @Request() request: AuthenticatedRequest,
    @Param('applicationId') applicationId: string,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (!file)
      throw new BadRequestException('Veuillez choisir un fichier valide.');
    return this.documentsService.create(applicationId, request.user.id, file);
  }
}
