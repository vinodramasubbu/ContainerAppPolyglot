using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;
using MovieList.Models;
using System.Data;
using Microsoft.AspNetCore.Cors;

namespace MovieList.Controllers
{
    
    [ApiController]
    [Route("[controller]")]
    public class MovieController : ControllerBase
    {
        private readonly IConfiguration _configuration;


        public MovieController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [EnableCors("AllowOrigin")]
        [HttpGet]
        public JsonResult Get()
        {
            string query = @"
                            select 
                                    Id,
                                    Title,
                                    ReleaseDate,
                                    Genre,
                                    Price 
                            from
                                dbo.Movie
                            ";

            DataTable table = new DataTable();
            string sqlDataSource = _configuration.GetConnectionString("MovieDatabaseConn");
            SqlDataReader myReader;
            using (SqlConnection myCon = new SqlConnection(sqlDataSource))
            {
                myCon.Open();
                using (SqlCommand myCommand = new SqlCommand(query, myCon))
                {
                    myReader = myCommand.ExecuteReader();
                    table.Load(myReader);
                    myReader.Close();
                    myCon.Close();
                }
            }

            return new JsonResult(table);
        }

        [EnableCors("AllowOrigin")]
        [HttpGet("{id}")]
        public JsonResult Get(int id)
        {
            string query = @"
                            select 
                                    Id,
                                    Title,
                                    ReleaseDate,
                                    Genre,
                                    Price 
                            from
                                dbo.Movie where Id=@Id
                            ";

            DataTable table = new DataTable();
            string sqlDataSource = _configuration.GetConnectionString("MovieDatabaseConn");
            SqlDataReader myReader;
            using (SqlConnection myCon = new SqlConnection(sqlDataSource))
            {
                myCon.Open();
                using (SqlCommand myCommand = new SqlCommand(query, myCon))
                {
                    myCommand.Parameters.AddWithValue("@Id", id);
                    myReader = myCommand.ExecuteReader();
                    table.Load(myReader);
                    myReader.Close();
                    myCon.Close();
                }
            }

            return new JsonResult(table);
        }

        [EnableCors("AllowOrigin")]
        [HttpPost]
        public JsonResult Post(Movie movie)
        {
            string query = @"
                           insert into dbo.Movie
                           (   Id,Title, ReleaseDate, Genre,Price)
                    values (@Id,@Title,@ReleaseDate,@Genre,@Price)
                            ";

            DataTable table = new DataTable();
            string sqlDataSource = _configuration.GetConnectionString("MovieDatabaseConn");
            SqlDataReader myReader;
            using (SqlConnection myCon = new SqlConnection(sqlDataSource))
            {
                myCon.Open();
                using (SqlCommand myCommand = new SqlCommand(query, myCon))
                {
                    myCommand.Parameters.AddWithValue("@Id", movie.Id);
                    myCommand.Parameters.AddWithValue("@Title", movie.Title);
                    myCommand.Parameters.AddWithValue("@ReleaseDate", movie.ReleaseDate);
                    myCommand.Parameters.AddWithValue("@Genre", movie.Genre);
                    myCommand.Parameters.AddWithValue("@Price", movie.Price);
                    myReader = myCommand.ExecuteReader();
                    table.Load(myReader);
                    myReader.Close();
                    myCon.Close();
                }
            }

            return new JsonResult("Added Successfully");
        }

        [EnableCors("AllowOrigin")]
        [HttpPut]
        public JsonResult Put(Movie movie)
        {
            string query = @"
                           update dbo.Movie
                           set Title= @Title,
                            ReleaseDate=@ReleaseDate,
                            Genre=@Genre,
                            Price=@Price
                            where Id=@Id
                            ";

            DataTable table = new DataTable();
            string sqlDataSource = _configuration.GetConnectionString("MovieDatabaseConn");
            SqlDataReader myReader;
            using (SqlConnection myCon = new SqlConnection(sqlDataSource))
            {
                myCon.Open();
                using (SqlCommand myCommand = new SqlCommand(query, myCon))
                {
                    myCommand.Parameters.AddWithValue("@Id", movie.Id);
                    myCommand.Parameters.AddWithValue("@Title", movie.Title);
                    myCommand.Parameters.AddWithValue("@ReleaseDate", movie.ReleaseDate);
                    myCommand.Parameters.AddWithValue("@Genre", movie.Genre);
                    myCommand.Parameters.AddWithValue("@Price", movie.Price);
                    myReader = myCommand.ExecuteReader();
                    table.Load(myReader);
                    myReader.Close();
                    myCon.Close();
                }
            }

            return new JsonResult("Updated Successfully");
        }

        [EnableCors("AllowOrigin")]
        [HttpDelete("{id}")]
        public JsonResult Delete(int id)
        {
            string query = @"
                           delete from dbo.Movie
                            where Id=@Id
                            ";

            DataTable table = new DataTable();
            string sqlDataSource = _configuration.GetConnectionString("MovieDatabaseConn");
            SqlDataReader myReader;
            using (SqlConnection myCon = new SqlConnection(sqlDataSource))
            {
                myCon.Open();
                using (SqlCommand myCommand = new SqlCommand(query, myCon))
                {
                    myCommand.Parameters.AddWithValue("@Id", id);

                    myReader = myCommand.ExecuteReader();
                    table.Load(myReader);
                    myReader.Close();
                    myCon.Close();
                }
            }

            return new JsonResult("Deleted Successfully");
        }





    }
}
