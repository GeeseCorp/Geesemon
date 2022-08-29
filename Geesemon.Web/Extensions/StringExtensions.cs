using System.Security.Cryptography;
using System.Text;

namespace Geesemon.Web.Extensions;

public static class StringExtensions
{
    public static string CreateMD5(this string input)
    {
        using (MD5 md5 = MD5.Create())
        {
            byte[] inputBytes = Encoding.Unicode.GetBytes(input);
            byte[] hashBytes = md5.ComputeHash(inputBytes);
            return Convert.ToHexString(hashBytes);
        }
    }

    public static string CreateMD5WithSalt(this string input, out string salt)
    {
        salt = CreateSalt(30);
        return (input + salt).CreateMD5();
    }

    public static string CreateSalt(int size)
    {
        RNGCryptoServiceProvider rng = new RNGCryptoServiceProvider();
        byte[] buff = new byte[size];
        rng.GetBytes(buff);
        return Convert.ToBase64String(buff);
    }
}
