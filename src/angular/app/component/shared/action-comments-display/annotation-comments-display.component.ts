import { Component, Input } from '@angular/core';

import { Action, Annotation } from '../../../../../../type/refBack';

@Component({
  selector: 'app-annotation-comments-display',
  templateUrl: './annotation-comments-display.component.html',
  styleUrls: ['./annotation-comments-display.component.scss']
})
export class AnnotationCommentsDisplayComponent {
    @Input() annotation!: Action|Annotation;
    @Input() inline = false;
}
