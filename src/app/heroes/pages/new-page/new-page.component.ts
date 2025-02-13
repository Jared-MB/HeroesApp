import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Hero, Publisher } from '../../interfaces/hero.interface';
import { HeroesService } from '../../services/heroes.service';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, switchMap, tap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-new-page',
  templateUrl: './new-page.component.html',
  styles: ``
})
export class NewPageComponent implements OnInit {

  public heroForm = new FormGroup({
    id: new FormControl(''),
    superhero: new FormControl('', {
      nonNullable: true
    }),
    publisher: new FormControl<Publisher>(Publisher.DCComics),
    alter_ego: new FormControl(''),
    first_appearance: new FormControl(''),
    characters: new FormControl(''),
    alt_img: new FormControl('')
  })

  public publishers = [
    { id: 'DC Comics', desc: 'DC - Comics' },
    { id: 'Marvel Comics', desc: 'Marvel - Comics' }
  ]

  constructor(
    private readonly heroService: HeroesService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
    private readonly snackBar: MatSnackBar,
    private readonly dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.router.url.includes('edit') && this.activatedRoute.params.pipe(
      switchMap(({ id }) => this.heroService.getHeroById(id))
    ).subscribe(hero => {
      if (!hero) {
        return this.router.navigateByUrl('/');
      }

      this.heroForm.reset(hero);
      return
    })
  }

  get currentHero(): Hero {
    const hero = this.heroForm.value as Hero;
    return hero;
  }

  onSubmit(): void {

    if (this.heroForm.invalid) {
      return;
    }

    if (this.currentHero.id) {
      this.heroService.updateHero(this.currentHero)
        .subscribe(hero => {
          this.showSnackBar(`${hero.superhero} updated`)
        })
      return
    }

    this.heroService.addHero(this.currentHero)
      .subscribe(hero => {
        this.router.navigateByUrl('/heroes/edit/' + hero.id)
        this.showSnackBar(`${hero.superhero} added`)
      })
  }

  onDeleteHero(): void {
    if (!this.currentHero.id) {
      throw new Error('Hero ID is required');
    }

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: this.heroForm.value,
    });

    dialogRef.afterClosed().pipe(
      filter((result: boolean) => result),
      switchMap(() => this.heroService.deleteHero(this.currentHero.id)),
      filter(wasDeleted => wasDeleted),
    ).subscribe(() =>
      this.router.navigateByUrl('/heroes')
    );
  }

  showSnackBar(message: string): void {
    this.snackBar.open(message, 'Ok!', {
      duration: 2500
    })
  }

}
