"use strict";

/*global UserIdReplacer, loadFixtures*/
describe("UserIdReplacer", function() {

    var replacer;
    var isAllowedUrl;
    var userIdStringReplacer;

    var testUserId1 = "d000007";
    var testUserName1 = "Superman";

    beforeEach(function() {
        jasmine.getFixtures().fixturesPath = "test/fixtures";
        var restricter = new ReplaceRestricter();
        isAllowedUrl = true;
        restricter.isAllowedUrl = function() {
            return isAllowedUrl;
        };
        userIdStringReplacer = new UserIdStringReplacer("https://github.wdf.sap.corp");
        replacer = new UserIdReplacer(restricter, userIdStringReplacer);

    });

    afterEach(function() {
        jasmine.Ajax.uninstall();
    });

    it("don't run replacer for not allowed URL", function() {
        isAllowedUrl = false;
        var replaceCalled = false;
        userIdStringReplacer.replaceUserIds = function() {
            replaceCalled = true;
        };
        replacer.replaceUserIDs();
        expect(replaceCalled).toEqual(false);
    });

    it("it should replace all user Ids on the page", function() {
        loadFixtures("testGithubCommits.html");

        // Mock Ajax Request
        jasmine.Ajax.install();
        var response = {
            "name": testUserName1
        };
        jasmine.Ajax.stubRequest(userIdStringReplacer.githubUserApiUrl + testUserId1).andReturn({
            "responseText": JSON.stringify(response)
        });

        // Execute
        replacer.replaceUserIDs();
        expect(jQuery("*:contains(\"Superman\")").length).toEqual(48);
    });

});