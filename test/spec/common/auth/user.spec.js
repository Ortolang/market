'use strict';

describe('Service: User', function () {

    // load the service's module
    beforeEach(angular.mock.module('ortolangMarketApp'));
    beforeEach(angular.mock.module('ortolangMarketAppMock'));

    // instantiate service
    var GroupResource,
        User,
        AuthService,
        sample;
    beforeEach(inject(function (_GroupResource_, _User_, _AuthService_, _sample_) {
        GroupResource = _GroupResource_;
        AuthService = _AuthService_;
        User = _User_;
        sample = _sample_;
    }));

    afterEach(function () {
        inject(function ($httpBackend) {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });
    });

    it('should exist', function () {
        expect(!!User).toBe(true);
    });

    it('should init givenName and fullName when pre-initializing', function () {
        User.preInit(sample().profileFull);
        expect(User.givenName).toBe('Foo');
        expect(User.familyName).toBe('Bar');
    });

    it('should init properties properly when creating', function () {
        User.create(sample().profileFull);
        expect(User.email).toBe('foo.bar@mock.com');
        expect(User.emailHash).toBe('hash');
        expect(User.key).toBe('foobar');
        expect(User.givenName).toBe('Foo');
        expect(User.familyName).toBe('Bar');
        expect(User.isModerator).toBe(false);
        // Moderator
        User.create(sample().profile);
        expect(User.isModerator).toBe(true);
    });

    it('should return user full name', function () {
        expect(User.fullName()).toBe('');
        User.create(sample().profileFull);
        expect(User.fullName()).toBe('Foo Bar');
    });

    it('should return a profile data', function () {
        User.create(sample().profileFull);
        expect(User.getProfileData).toBeDefined();
        expect(User.getProfileData('foo')).toBe('bar');
    });

    it('should fetch user friend list', function () {
        AuthService.resolveSessionInitialized();
        expect(User.isFriend).toBeDefined();
        expect(User.isFriend('jgrant')).not.toBeDefined();
        User.create(sample().profileFull);
        expect(User.isFriend('jgrant')).not.toBeDefined();
        expect(User.fetchFriendList).toBeDefined();
        User.fetchFriendList().then(function () {
            expect(User.isFriend('jgrant')).toBe(true);
            expect(User.isFriend('elvis')).toBe(false);
        });
    });
});
