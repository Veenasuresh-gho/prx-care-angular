import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footer } from '../../features/footer/footer';
import { Navbar } from '../../features/navbar/navbar';

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [RouterOutlet,Footer,Navbar],
  templateUrl: './public-layout.html',
})
export class PublicLayout {}