<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * Oeuvre
 *
 * @ORM\Table(name="oeuvre")
 * @ORM\Entity(repositoryClass="AppBundle\Repository\OeuvreRepository")
 */
class Oeuvre
{
    /**
     * @var int
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @var string
     * @Assert\NotBlank()
     * @Assert\Length(min=3)
     * @ORM\Column(name="title", type="string", length=255)
     */
    private $title;

    /**
     * @var string
     *
     * @ORM\Column(name="url_product", type="string", length=255)
     */
    private $url_product;

    /**
     * @var string
     * @Assert\NotBlank()
     * @Assert\Length(min=20)
     * @ORM\Column(name="description", type="text")
     */
    private $description;

    /**
     * @var string
     *  
     * @ORM\Column(name="url_image", type="string", length=255)
     */
    private $url_image;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="publication_date", type="date")
     */
    private $publication_date;

    /**
     * @var \int
     *
     * @ORM\Column(name="rating", type="integer")
     */
    private $rating;

    /**
     * @ORM\ManyToOne(targetEntity="Author", inversedBy="oeuvres")
     * @ORM\JoinColumn(name="author_id", referencedColumnName="id")
     */
    private $author;

    /**
     * @ORM\OneToMany(targetEntity="Salon", mappedBy="salon")
     */
    private $salons;

    /**
     * Get id
     *
     * @return int
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set title
     *
     * @param string $title
     *
     * @return Oeuvre
     */
    public function setTitle($title)
    {
        $this->title = $title;

        return $this;
    }

    /**
     * Get title
     *
     * @return string
     */
    public function getTitle()
    {
        return $this->title;
    }

    /**
     * Set urlProduct
     *
     * @param string $urlProduct
     *
     * @return Oeuvre
     */
    public function setUrlProduct($urlProduct)
    {
        $this->url_product = $urlProduct;

        return $this;
    }

    /**
     * Get urlProduct
     *
     * @return string
     */
    public function getUrlProduct()
    {
        return $this->url_product;
    }

    /**
     * Set description
     *
     * @param string $description
     *
     * @return Oeuvre
     */
    public function setDescription($description)
    {
        $this->description = $description;

        return $this;
    }

    /**
     * Get description
     *
     * @return string
     */
    public function getDescription()
    {
        return $this->description;
    }

    /**
     * Set urlImage
     *
     * @param string $urlImage
     *
     * @return Oeuvre
     */
    public function setUrlImage($urlImage)
    {
        $this->url_image = $urlImage;

        return $this;
    }

    /**
     * Get urlImage
     *
     * @return string
     */
    public function getUrlImage()
    {
        return $this->url_image;
    }

    /**
     * Set publicationDate
     *
     * @param \DateTime $publicationDate
     *
     * @return Oeuvre
     */
    public function setPublicationDate($publicationDate)
    {
        $this->publication_date = $publicationDate;

        return $this;
    }

    /**
     * Get publicationDate
     *
     * @return \DateTime
     */
    public function getPublicationDate()
    {
        return $this->publication_date;
    }

    /**
     * Set author
     *
     * @param \AppBundle\Entity\Author $author
     *
     * @return Oeuvre
     */
    public function setAuthor(\AppBundle\Entity\Author $author = null)
    {
        $this->author = $author;

        return $this;
    }

    /**
     * Get author
     *
     * @return \AppBundle\Entity\Author
     */
    public function getAuthor()
    {
        return $this->author;
    }
    /**
     * Constructor
     */
    public function __construct()
    {
        $this->salons = new \Doctrine\Common\Collections\ArrayCollection();
    }

    /**
     * Add salon
     *
     * @param \AppBundle\Entity\Salon $salon
     *
     * @return Oeuvre
     */
    public function addSalon(\AppBundle\Entity\Salon $salon)
    {
        $this->salons[] = $salon;

        return $this;
    }

    /**
     * Remove salon
     *
     * @param \AppBundle\Entity\Salon $salon
     */
    public function removeSalon(\AppBundle\Entity\Salon $salon)
    {
        $this->salons->removeElement($salon);
    }

    /**
     * Get salons
     *
     * @return \Doctrine\Common\Collections\Collection
     */
    public function getSalons()
    {
        return $this->salons;
    }

    /**
     * Set rating
     *
     * @param integer $rating
     *
     * @return Oeuvre
     */
    public function setRating($rating)
    {
        $this->rating = $rating;

        return $this;
    }

    /**
     * Get rating
     *
     * @return integer
     */
    public function getRating()
    {
        return $this->rating;
    }
}
