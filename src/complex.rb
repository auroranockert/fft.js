def real(x, offset = 0, i = nil, stride = nil)
  if stride
    "#{x}[2 * ((#{offset}) + (#{stride}) * (#{i}))]"
  elsif i
    "#{x}[2 * ((#{offset}) + (#{i}))]"
  elsif offset
    "#{x}[2 * (#{offset})]"
  else
    "#{x}[0]"
  end
end

def imag(x, offset = 0, i = nil, stride = nil)
  if stride
    "#{x}[2 * ((#{offset}) + (#{stride}) * (#{i})) + 1]"
  elsif i
    "#{x}[2 * ((#{offset}) + (#{i})) + 1]"
  elsif offset
    "#{x}[2 * (#{offset}) + 1]"
  else
    "#{x}[1]"
  end
end

def load(value, x, offset = 0, i = nil, stride = nil)
  "var #{value}_r = #{real(x, offset, i, stride)}, #{value}_i = #{imag(x, offset, i, stride)}"
end

def store(value, x, offset = 0, i = nil, stride = nil)
  "#{real(x, offset, i, stride)} = #{value}_r, #{imag(x, offset, i, stride)} = #{value}_i"
end

def cadd(result, a, b)
  "var #{result}_r = #{a}_r + #{b}_r, #{result}_i = #{a}_i + #{b}_i"
end

def csub(result, a, b)
  "var #{result}_r = #{a}_r - #{b}_r, #{result}_i = #{a}_i - #{b}_i"
end

def cmul(result, a, b)
  "var #{result}_r = #{a}_r * #{b}_r - #{a}_i * #{b}_i, #{result}_i = #{a}_r * #{b}_i + #{a}_i * #{b}_r"
end