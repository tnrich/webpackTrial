describe("annotation extra props", function () {
  it("", () => {
    cy.visit("http://localhost:3344/#/Editor?extraAnnotationPropsExample=true");
    cy.contains("Part 1 (digest)");
    cy.get(".partWithOverhangsIndicator");
  });
});
