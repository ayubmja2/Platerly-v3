using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Platerly.Server.Migrations
{
    /// <inheritdoc />
    public partial class ExtendApplicationUser : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Allergens",
                table: "AspNetUsers",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "[]");

            migrationBuilder.AddColumn<string>(
                name: "CookingLevel",
                table: "AspNetUsers",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "beginner");

            migrationBuilder.AddColumn<string>(
                name: "DietaryRestrictions",
                table: "AspNetUsers",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "[]");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Allergens",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "CookingLevel",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "DietaryRestrictions",
                table: "AspNetUsers");
        }
    }
}
