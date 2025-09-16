import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { AppService } from './app.service';
import OpenAI from 'openai';
import type { Request, Response } from 'express';

const client = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: 'sk-4c0107e0603e4be4b4ca2d95608b3219',
});

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('/chat')
  async chat(@Res() res: Response, @Body('message') message: string) {
    const completion = await client.chat.completions.create({
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        {
          content: message,
          role: 'user',
        },
      ],
      model: 'deepseek-chat',
      stream: true,
    });
    const iterator = completion[Symbol.asyncIterator]();
    let result = await iterator.next();
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    while (!result.done) {
      const content = result.value.choices[0].delta.content;
      if (content) {
        res.write(content);
      }
      result = await iterator.next();
    }
    res.end();
  }
}
