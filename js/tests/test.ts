import test from 'ava';
import UrlManager from '../src/UrlManager';

let urlManager = new UrlManager();
urlManager.configure({
    enablePrettyUrl: true,
    showScriptName: false,
    rules: [
        {
            name: '/',
            route: '/site/index'
        },
        {
            name: '/foo/<id:(\\d+)>/bar/<type:(first|second)>',
            route: '/foo/bar'
        }
    ]
});

test('it should create correct url which is contained parameters', t => {
    t.is('/foo/10/bar/first', urlManager.createUrl('foo/bar', {
        id : 10,
        type : "first"
    }));
    t.is('/foo/10/bar/first', urlManager.createUrl('/foo/bar', {
        id : 10,
        type : "first"
    }));
});

test('it should create correct url without parameters', t => {
    t.is('/', urlManager.createUrl('/site/index'));
});

test('it should create correct url with query string if parameters were passed', t => {

    t.is('/?foo=bar&param2=value2', urlManager.createUrl('/site/index', {
        'foo' : 'bar',
        'param2' : 'value2'
    }));

    t.is('/foo/bar?id=7&param2=value2', urlManager.createUrl('/foo/bar', {
        'id' : 7,
        'param2' : 'value2'
    }));

    t.is('/foo/bar?id=7&type=third', urlManager.createUrl('/foo/bar', {
        'id' : 7,
        'type' : 'third'
    }));

    t.is('/foo/7/bar/second?queryParam=value', urlManager.createUrl('/foo/bar', {
        'id' : 7,
        'type' : 'second',
        'queryParam' : 'value'
    }));
});

test('it should create url if route doesn\'t found', t => {
    t.is('/undefined-url/foo/bar', urlManager.createUrl('/undefined-url/foo/bar'));

    t.is('/undefined-url/foo/bar?param1=value1&param2=value2', urlManager.createUrl('/undefined-url/foo/bar', {
        'param1' : 'value1',
        'param2' : 'value2'
    }));
});

test('it should create url if showScriptName is true', t => {
    urlManager.configure({
        enablePrettyUrl: true,
        showScriptName: true,
        rules: [
            {
                name: '/foo/<id:(\\d+)>/bar/<type:(first|second)>',
                route: '/foo/bar'
            }
        ]
    });
    t.is('/index.php/foo/10/bar/first', urlManager.createUrl('/foo/bar', {
        'id' : 10,
        'type' : 'first'
    }));
});

test('it should create url if enablePrettyUrl is false', t => {
    urlManager.configure({
        enablePrettyUrl: false,
        suffix: '.html',
        rules: [
            {
                name: '/foo/<id:(\\d+)>/bar/<type:(first|second)>',
                route: '/foo/bar'
            }
        ]
    });
    t.is('/index.php?r=foo%2Fbar&id=10&type=first', urlManager.createUrl('/foo/bar', {
        'id' : 10,
        'type' : 'first'
    }));
});
test('it should create url if suffix passed', t => {
    urlManager.configure({
        enablePrettyUrl: true,
        showScriptName: false,
        suffix : '.html',
        rules: [
            {
                name: '/',
                route: '/site/index'
            },
            {
                name: '/create',
                route: '/site/create'
            },
            {
                name: '/foo/<id:(\\d+)>/bar/<type:(first|second)>',
                route: '/foo/bar',
                suffix: '/'
            }
        ]
    });
    t.is('/', urlManager.createUrl('/site/index'));
    t.is('/create.html', urlManager.createUrl('/site/create'));
    t.is('/foo/10/bar/first/', urlManager.createUrl('/foo/bar', {
        id: 10,
        type: 'first'
    }));
    t.is('/foo/bar/?id=10&type=third', urlManager.createUrl('/foo/bar', {
        id: 10,
        type: 'third'
    }));
});