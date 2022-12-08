import {
    ExpirationCompleteEvent,
    Publisher,
    Subjects,
} from '@rp-gittix/common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
    readonly subject = Subjects.ExpirationComplete;
}
