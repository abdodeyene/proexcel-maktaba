import {
  Controller, Post, UploadedFile, UploadedFiles,
  UseGuards, UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

function storage(folder: string) {
  return diskStorage({
    destination: join(process.cwd(), 'uploads', folder),
    filename: (_req, file, cb) => {
      const unique = Date.now() + '-' + Math.round(Math.random() * 1e6);
      cb(null, unique + extname(file.originalname));
    },
  });
}

@Controller('api/upload')
@UseGuards(JwtAuthGuard)
export class UploadController {
  @Post('product-image')
  @UseInterceptors(FileInterceptor('file', { storage: storage('products') }))
  uploadProductImage(@UploadedFile() file: Express.Multer.File) {
    return { url: `/uploads/products/${file.filename}` };
  }

  @Post('product-images')
  @UseInterceptors(FilesInterceptor('files', 10, { storage: storage('products') }))
  uploadProductImages(@UploadedFiles() files: Express.Multer.File[]) {
    return { urls: files.map(f => `/uploads/products/${f.filename}`) };
  }

  @Post('logo')
  @UseInterceptors(FileInterceptor('file', { storage: storage('logo') }))
  uploadLogo(@UploadedFile() file: Express.Multer.File) {
    return { url: `/uploads/logo/${file.filename}` };
  }

  @Post('slider')
  @UseInterceptors(FileInterceptor('file', { storage: storage('sliders') }))
  uploadSlider(@UploadedFile() file: Express.Multer.File) {
    return { url: `/uploads/sliders/${file.filename}` };
  }

  @Post('category-image')
  @UseInterceptors(FileInterceptor('file', { storage: storage('categories') }))
  uploadCategoryImage(@UploadedFile() file: Express.Multer.File) {
    return { url: `/uploads/categories/${file.filename}` };
  }
}
