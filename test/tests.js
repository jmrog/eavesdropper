var expect = chai.expect;

describe('Basic Test Functionality', function() {
    it('should work', function() {
        expect(true).to.be.true;
    });
});

describe("Core Eavesdropper Functionality", function() {
    // TODO: At some point it may be worth modularizing and browserifying tests, but for the moment
    // this single file seems to be okay.
    var divOnly = $('div.whatever'),
        spanOnly = $('span.whatever'),
        divAndSpan = $('.whatever');
    var result, tempResult, counter = 0;

    function testFunction() {
        return 'click'
    }

    beforeEach(function() {
        result = tempResult = counter = 0;
        divOnly.off();
        spanOnly.off();
        divAndSpan.off();
    });

    it('should return an empty array when an element has had no listeners set', function() {
        result = divOnly.eavesdrop();
        expect($.isArray(result) && result.length === 0).to.be.true;
    })

    it('should return correct data when one listener is added', function() {
        divOnly.first().on('click', testFunction);
        result = divOnly.eavesdrop();
        expect($.isArray(result) && result.length === 1).to.be.true;
        expect(result[0]).to.deep.equal({ type: 'click', listener: testFunction });
    });

    it('should return correct data when multiple listeners are added using "object" style', function() {
        divOnly.on({
            'click2': function() { return 'click2'; },
            'click.namespaced.name1': function() { return 'click.namespaced.name1'; },
            'click.namespaced.name2': function() { return 'click.namespaced.name2'; },
            'click.something': function() { return 'click.something'; },
            'click': function() { return 'click'; }
        });
        result = divOnly.eavesdrop();
        expect(result.length).to.equal(5);

        tempResult = true;
        $.each(result, function(idx, obj) {
            var name = obj.type;
            if (obj.listener() !== name) {
                tempResult = false;
            }
            if (name === 'click') {
                counter++;
            }
        });
        expect(tempResult).to.be.true;
        expect(counter).to.equal(1);
    });

    it('should correctly track events removed via namespaced types', function() {
        spanOnly.on({
            'click2': function() { return 'click2'; },
            'click.namespaced.name1': function() { return 'click.namespaced.name1'; },
            'click.namespaced.name2': function() { return 'click.namespaced.name2'; },
            'click.something': function() { return 'click.something'; },
            'click': function() { return 'click'; }
        });
        spanOnly.off('click.namespaced');
        result = spanOnly.eavesdrop();
        expect(result.length).to.equal(3);
        spanOnly.off('click');
        result = spanOnly.eavesdrop();
        expect(result.length).to.equal(1);
        expect(result).to.satisfy(function(result) {
            return result[0].type === 'click2';
        });
    });

    it('should correctly handle nested elements and elements that share a class (essentially as jQuery handles them)', function() {
        spanOnly.on({
            'change': function() {},
            'focus': function() {}
        });
        result = divOnly.eavesdrop();
        tempResult = spanOnly.eavesdrop();
        expect(tempResult.length === 2 && result.length === 0).to.be.true;
        divAndSpan.on('click', function() {});
        tempResult = spanOnly.eavesdrop();
        result = divOnly.eavesdrop();
        expect(tempResult.length === 3 && result.length === 1).to.be.true;
        tempResult = divAndSpan.eavesdrop();
        expect(tempResult.length === 1 && result[0].listener === tempResult[0].listener).to.be.true;
    });
});

