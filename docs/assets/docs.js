$(document).ready(function() {
   $('.table').tableFilter({
        placeholder: 'Search for something',
        class: 'form-control form-control-sm',
        min: 0,
        minlength: 3,
        pause: 1000
    });
});