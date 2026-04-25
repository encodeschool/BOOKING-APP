package uz.encode.fresh.common_security.jwt;

import java.util.Date;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

public class JwtUtil {

    private final JwtProperties props;

    public JwtUtil(JwtProperties props) {
        this.props = props;
    }

    public String generateToken(Long userId, String email) {
        return Jwts.builder()
                .setSubject(String.valueOf(userId))
                .claim("email", email)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + props.getExpiration()))
                .signWith(SignatureAlgorithm.HS256, props.getSecret())
                .compact();
    }

    public Claims parseToken(String token) {
        return Jwts.parser()
                .setSigningKey(props.getSecret())
                .parseClaimsJws(token)
                .getBody();
    }

    public Long extractUserId(String token) {
        return Long.parseLong(parseToken(token).getSubject());
    }

    public String extractEmail(String token) {
        return (String) parseToken(token).get("email");
    }
}